'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Event, Registration } from '@/types';

interface EventState {
  events: Event[];
  featuredEvents: Event[];
  registrations: Registration[];
  isLoading: boolean;
  error: string | null;
  selectedEvent: Event | null;
}

type EventAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_SELECTED_EVENT'; payload: Event | null }
  | { type: 'SET_REGISTRATIONS'; payload: Registration[] }
  | { type: 'ADD_REGISTRATION'; payload: Registration }
  | { type: 'CANCEL_REGISTRATION'; payload: string }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string };

interface RegistrationData {
  tickets: number;
  totalAmount: number;
  paymentMethod: string;
  attendeeNames: string[];
  email: string;
  phone: string;
}

interface EventContextType extends EventState {
  getEventById: (eventId: string) => Event | undefined;
  selectEvent: (eventId: string) => Event | undefined;
  registerForEvent: (eventId: string, userId: string, registrationData: RegistrationData) => Promise<{ success: boolean; registration?: Registration; error?: string }>;
  cancelRegistration: (registrationId: string) => Promise<{ success: boolean; error?: string }>;
  getUserRegistrations: (userId: string) => Registration[];
  isUserRegistered: (eventId: string, userId: string) => boolean;
  addEvent: (eventData: Partial<Event>) => Promise<{ success: boolean; event?: Event; error?: string }>;
  deleteEvent: (eventId: string) => Promise<{ success: boolean; error?: string }>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | null>(null);

const initialState: EventState = {
  events: [],
  featuredEvents: [],
  registrations: [],
  isLoading: true,
  error: null,
  selectedEvent: null
};

const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_EVENTS':
      return { 
        ...state, 
        events: action.payload, 
        featuredEvents: action.payload.filter(e => e.featured),
        isLoading: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    case 'SET_REGISTRATIONS':
      return { ...state, registrations: action.payload };
    case 'ADD_REGISTRATION':
      return { 
        ...state, 
        registrations: [...state.registrations, action.payload],
        events: state.events.map(event => 
          event.id === action.payload.eventId 
            ? { ...event, registered: event.registered + action.payload.tickets }
            : event
        )
      };
    case 'CANCEL_REGISTRATION':
      const registration = state.registrations.find(r => r.id === action.payload);
      return { 
        ...state, 
        registrations: state.registrations.filter(r => r.id !== action.payload),
        events: state.events.map(event => 
          event.id === registration?.eventId 
            ? { ...event, registered: Math.max(0, event.registered - (registration?.tickets || 0)) }
            : event
        )
      };
    case 'ADD_EVENT':
      return { 
        ...state, 
        events: [...state.events, action.payload],
        featuredEvents: action.payload.featured 
          ? [...state.featuredEvents, action.payload] 
          : state.featuredEvents
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(e => e.id !== action.payload),
        featuredEvents: state.featuredEvents.filter(e => e.id !== action.payload)
      };
    default:
      return state;
  }
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Fetch events from API on mount
  const fetchEvents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/events');
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: 'SET_EVENTS', payload: result.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to fetch events' });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch events' });
    }
  };

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Get single event by ID
  const getEventById = (eventId: string): Event | undefined => {
    return state.events.find(event => event.id === eventId);
  };

  // Select an event for viewing
  const selectEvent = (eventId: string): Event | undefined => {
    const event = getEventById(eventId);
    dispatch({ type: 'SET_SELECTED_EVENT', payload: event || null });
    return event;
  };

  // Refresh events from API
  const refreshEvents = async () => {
    await fetchEvents();
  };

  // Register for an event (with payment flow)
  const registerForEvent = async (eventId: string, userId: string, registrationData: RegistrationData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Step 1: Create booking via API
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          userId,
          ...registrationData
        })
      });
      
      const bookingResult = await bookingResponse.json();
      
      if (!bookingResult.success) {
        throw new Error(bookingResult.error || 'Failed to create booking');
      }

      const booking = bookingResult.data;

      // Step 2: For free events, directly confirm. For paid events, payment would happen on frontend
      if (registrationData.totalAmount === 0) {
        // Free event - directly confirm
        await fetch('/api/bookings/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id,
            paymentId: 'FREE_EVENT'
          })
        });
        
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
      }
      
      dispatch({ type: 'ADD_REGISTRATION', payload: booking });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, registration: booking };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: message };
    }
  };

  // Cancel registration
  const cancelRegistration = async (registrationId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // In production, call API to cancel booking
      // For now, just update local state
      dispatch({ type: 'CANCEL_REGISTRATION', payload: registrationId });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cancellation failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: message };
    }
  };

  // Get user's registrations
  const getUserRegistrations = (userId: string): Registration[] => {
    return state.registrations.filter(r => r.userId === userId);
  };

  // Check if user is registered for an event
  const isUserRegistered = (eventId: string, userId: string): boolean => {
    return state.registrations.some(r => r.eventId === eventId && r.userId === userId);
  };

  // Add new event via API
  const addEvent = async (eventData: Partial<Event>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create event');
      }
      
      dispatch({ type: 'ADD_EVENT', payload: result.data });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, event: result.data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: message };
    }
  };

  // Delete event via API
  const deleteEvent = async (eventId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete event');
      }
      
      dispatch({ type: 'DELETE_EVENT', payload: eventId });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete event';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: message };
    }
  };

  const value: EventContextType = {
    ...state,
    getEventById,
    selectEvent,
    registerForEvent,
    cancelRegistration,
    getUserRegistrations,
    isUserRegistered,
    addEvent,
    deleteEvent,
    refreshEvents
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;
