'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { storage } from '@/utils/helpers';
import { mockEvents } from '@/data/mockEvents';
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
  | { type: 'ADD_EVENT'; payload: Event };

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
    default:
      return state;
  }
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Load events and registrations on mount
  useEffect(() => {
    const loadData = () => {
      // Load events (use mock events or saved events)
      let savedEvents = storage.get<Event[]>('eventfdr_events');
      if (!savedEvents || savedEvents.length === 0) {
        savedEvents = mockEvents;
        storage.set('eventfdr_events', mockEvents);
      }
      dispatch({ type: 'SET_EVENTS', payload: savedEvents });
      
      // Load user's registrations
      const savedRegistrations = storage.get<Registration[]>('eventfdr_registrations') || [];
      dispatch({ type: 'SET_REGISTRATIONS', payload: savedRegistrations });
    };
    
    // Simulate loading delay
    setTimeout(loadData, 500);
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

  // Register for an event
  const registerForEvent = async (eventId: string, userId: string, registrationData: RegistrationData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const event = getEventById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Check availability
      const available = event.capacity - event.registered;
      if (registrationData.tickets > available) {
        throw new Error(`Only ${available} tickets available`);
      }
      
      const registration: Registration = {
        id: 'reg-' + Date.now(),
        eventId,
        userId,
        eventTitle: event.title,
        eventDate: event.date,
        eventImage: event.image,
        eventVenue: event.venue,
        eventCity: event.city,
        ...registrationData,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        ticketCode: 'TKT' + Math.random().toString(36).substr(2, 8).toUpperCase()
      };
      
      // Save to storage
      const allRegistrations = storage.get<Registration[]>('eventfdr_registrations') || [];
      allRegistrations.push(registration);
      storage.set('eventfdr_registrations', allRegistrations);
      
      // Update events in storage
      const events = storage.get<Event[]>('eventfdr_events') || [];
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        events[eventIndex].registered += registrationData.tickets;
        storage.set('eventfdr_events', events);
      }
      
      dispatch({ type: 'ADD_REGISTRATION', payload: registration });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, registration };
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const registration = state.registrations.find(r => r.id === registrationId);
      if (!registration) {
        throw new Error('Registration not found');
      }
      
      // Update storage
      const allRegistrations = storage.get<Registration[]>('eventfdr_registrations') || [];
      const updatedRegistrations = allRegistrations.filter(r => r.id !== registrationId);
      storage.set('eventfdr_registrations', updatedRegistrations);
      
      // Update event registration count
      const events = storage.get<Event[]>('eventfdr_events') || [];
      const eventIndex = events.findIndex(e => e.id === registration.eventId);
      if (eventIndex !== -1) {
        events[eventIndex].registered = Math.max(0, events[eventIndex].registered - registration.tickets);
        storage.set('eventfdr_events', events);
      }
      
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

  // Add new event (for admin/organizers)
  const addEvent = async (eventData: Partial<Event>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent: Event = {
        id: 'evt-' + Date.now(),
        title: eventData.title || '',
        description: eventData.description || '',
        shortDescription: eventData.shortDescription || '',
        category: eventData.category || '',
        date: eventData.date || '',
        time: eventData.time || '',
        endDate: eventData.endDate || '',
        endTime: eventData.endTime || '',
        venue: eventData.venue || '',
        address: eventData.address || '',
        city: eventData.city || '',
        country: eventData.country || 'India',
        image: eventData.image || '',
        price: eventData.price || 0,
        currency: eventData.currency || 'INR',
        capacity: eventData.capacity || 100,
        registered: 0,
        organizer: eventData.organizer || { name: '', email: '', verified: false },
        tags: eventData.tags || [],
        featured: eventData.featured || false,
        status: 'upcoming',
        highlights: eventData.highlights || [],
        schedule: eventData.schedule || []
      };
      
      const events = storage.get<Event[]>('eventfdr_events') || [];
      events.push(newEvent);
      storage.set('eventfdr_events', events);
      
      dispatch({ type: 'ADD_EVENT', payload: newEvent });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, event: newEvent };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event';
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
    addEvent
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
