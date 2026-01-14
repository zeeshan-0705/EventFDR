/**
 * Database Store - Simulates a database using in-memory storage
 * This can be replaced with Supabase/MongoDB calls later
 * 
 * For production, replace these functions with actual database queries
 */

import { Event, Registration, User } from '@/types';
import { mockEvents } from '@/data/mockEvents';

// In-memory data store (simulates database)
// In production, this would be replaced with actual database calls
let eventsStore: Event[] = [...mockEvents];
let usersStore: User[] = [];
let bookingsStore: Registration[] = [];

// ========== EVENTS ==========

export const db = {
  events: {
    findAll: async (): Promise<Event[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return eventsStore;
    },

    findById: async (id: string): Promise<Event | null> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return eventsStore.find(e => e.id === id) || null;
    },

    findByCategory: async (category: string): Promise<Event[]> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (category === 'All Events') return eventsStore;
      return eventsStore.filter(e => e.category === category);
    },

    findFeatured: async (): Promise<Event[]> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return eventsStore.filter(e => e.featured);
    },

    create: async (eventData: Partial<Event>): Promise<Event> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
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
        image: eventData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        price: eventData.price || 0,
        currency: eventData.currency || 'INR',
        capacity: eventData.capacity || 100,
        registered: 0,
        organizer: eventData.organizer || { name: 'Event Organizer', email: 'organizer@example.com', verified: false },
        tags: eventData.tags || [],
        featured: eventData.featured || false,
        status: 'upcoming',
        highlights: eventData.highlights || [],
        schedule: eventData.schedule || []
      };
      
      eventsStore.push(newEvent);
      return newEvent;
    },

    update: async (id: string, updates: Partial<Event>): Promise<Event | null> => {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const index = eventsStore.findIndex(e => e.id === id);
      if (index === -1) return null;
      
      eventsStore[index] = { ...eventsStore[index], ...updates };
      return eventsStore[index];
    },

    delete: async (id: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const initialLength = eventsStore.length;
      eventsStore = eventsStore.filter(e => e.id !== id);
      return eventsStore.length < initialLength;
    },

    incrementRegistrations: async (id: string, count: number): Promise<boolean> => {
      const event = eventsStore.find(e => e.id === id);
      if (!event) return false;
      event.registered += count;
      return true;
    }
  },

  // ========== USERS ==========
  users: {
    findByEmail: async (email: string): Promise<User | null> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return usersStore.find(u => u.email === email) || null;
    },

    findById: async (id: string): Promise<User | null> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return usersStore.find(u => u.id === id) || null;
    },

    create: async (userData: Partial<User> & { password?: string }): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newUser: User = {
        id: 'user-' + Date.now(),
        email: userData.email || '',
        name: userData.name || '',
        phone: userData.phone,
        avatar: userData.avatar || null,
        createdAt: new Date().toISOString(),
        password: userData.password // In production, this should be hashed!
      };
      
      usersStore.push(newUser);
      return newUser;
    },

    update: async (id: string, updates: Partial<User>): Promise<User | null> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const index = usersStore.findIndex(u => u.id === id);
      if (index === -1) return null;
      
      usersStore[index] = { ...usersStore[index], ...updates };
      return usersStore[index];
    },

    validatePassword: async (email: string, password: string): Promise<User | null> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Demo account
      if (email === 'demo@eventfdr.com' && password === 'demo123') {
        return {
          id: 'demo-user',
          email: 'demo@eventfdr.com',
          name: 'Demo User',
          phone: '9876543210',
          avatar: null,
          createdAt: new Date().toISOString()
        };
      }
      
      const user = usersStore.find(u => u.email === email && u.password === password);
      if (!user) return null;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
  },

  // ========== BOOKINGS ==========
  bookings: {
    findByUserId: async (userId: string): Promise<Registration[]> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return bookingsStore.filter(b => b.userId === userId);
    },

    findByEventId: async (eventId: string): Promise<Registration[]> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return bookingsStore.filter(b => b.eventId === eventId);
    },

    findById: async (id: string): Promise<Registration | null> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return bookingsStore.find(b => b.id === id) || null;
    },

    create: async (bookingData: Partial<Registration>): Promise<Registration> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newBooking: Registration = {
        id: 'reg-' + Date.now(),
        eventId: bookingData.eventId || '',
        userId: bookingData.userId || '',
        eventTitle: bookingData.eventTitle || '',
        eventDate: bookingData.eventDate || '',
        eventImage: bookingData.eventImage || '',
        eventVenue: bookingData.eventVenue || '',
        eventCity: bookingData.eventCity || '',
        tickets: bookingData.tickets || 1,
        totalAmount: bookingData.totalAmount || 0,
        paymentMethod: bookingData.paymentMethod || 'card',
        attendeeNames: bookingData.attendeeNames || [],
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        status: 'pending', // Will be updated after payment
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        ticketCode: 'TKT' + Math.random().toString(36).substr(2, 8).toUpperCase()
      };
      
      bookingsStore.push(newBooking);
      return newBooking;
    },

    updatePaymentStatus: async (id: string, status: 'pending' | 'paid' | 'failed', paymentId?: string): Promise<Registration | null> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const booking = bookingsStore.find(b => b.id === id);
      if (!booking) return null;
      
      booking.paymentStatus = status;
      booking.status = status === 'paid' ? 'confirmed' : status === 'failed' ? 'cancelled' : 'pending';
      if (paymentId) {
        (booking as Registration & { razorpayPaymentId?: string }).razorpayPaymentId = paymentId;
      }
      
      return booking;
    },

    delete: async (id: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const initialLength = bookingsStore.length;
      bookingsStore = bookingsStore.filter(b => b.id !== id);
      return bookingsStore.length < initialLength;
    }
  }
};

export default db;
