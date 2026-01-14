// Utility functions for the Event Finder application
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { Event, EventFilters, PriceRange } from '@/types';

// Format currency in Indian Rupees
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date to readable string
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'dd MMM yyyy');
};

// Format date range
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  if (startDate === endDate) {
    return format(start, 'dd MMM yyyy');
  }
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'dd')} - ${format(end, 'dd MMM yyyy')}`;
  }
  
  return `${format(start, 'dd MMM')} - ${format(end, 'dd MMM yyyy')}`;
};

// Format time
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Get event status text
export const getEventStatus = (event: Event): { label: string; color: string } => {
  const now = new Date();
  const eventDate = parseISO(event.date);
  const endDate = parseISO(event.endDate);
  
  if (isAfter(now, endDate)) {
    return { label: 'Completed', color: 'badge-error' };
  }
  
  if (isToday(eventDate)) {
    return { label: 'Today', color: 'badge-success' };
  }
  
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil <= 7) {
    return { label: 'This Week', color: 'badge-warning' };
  }
  
  if (daysUntil <= 30) {
    return { label: 'This Month', color: 'badge-primary' };
  }
  
  return { label: 'Upcoming', color: 'badge-accent' };
};

// Get availability percentage
export const getAvailability = (event: Event): { available: number; percentage: number; status: string } => {
  const available = event.capacity - event.registered;
  const percentage = ((event.capacity - event.registered) / event.capacity) * 100;
  
  return {
    available,
    percentage,
    status: percentage <= 10 ? 'low' : percentage <= 30 ? 'medium' : 'high'
  };
};

// Generate unique ID
export const generateId = (): string => {
  return 'id-' + Math.random().toString(36).substr(2, 9);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Calculate days until event
export const getDaysUntil = (dateString: string): string => {
  const eventDate = parseISO(dateString);
  const now = new Date();
  const days = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days < 0) return 'Past';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
};

// Search and filter events
export const filterEvents = (events: Event[], filters: EventFilters): Event[] => {
  return events.filter(event => {
    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesQuery = 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesQuery) return false;
    }
    
    // Category filter
    if (filters.category && filters.category !== 'All Events') {
      if (event.category !== filters.category) return false;
    }
    
    // City filter
    if (filters.city && filters.city !== 'All Cities') {
      if (event.city !== filters.city) return false;
    }
    
    // Price filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (event.price < min || event.price > max) return false;
    }
    
    // Date filter
    if (filters.dateFrom) {
      const eventDate = parseISO(event.date);
      const filterDate = parseISO(filters.dateFrom);
      if (isBefore(eventDate, filterDate)) return false;
    }
    
    if (filters.dateTo) {
      const eventDate = parseISO(event.date);
      const filterDate = parseISO(filters.dateTo);
      if (isAfter(eventDate, filterDate)) return false;
    }
    
    return true;
  });
};

// Sort events
export const sortEvents = (events: Event[], sortBy: string): Event[] => {
  const sortedEvents = [...events];
  
  switch (sortBy) {
    case 'date-asc':
      return sortedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'date-desc':
      return sortedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'price-asc':
      return sortedEvents.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedEvents.sort((a, b) => b.price - a.price);
    case 'popularity':
      return sortedEvents.sort((a, b) => b.registered - a.registered);
    case 'name':
      return sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedEvents;
  }
};

// Get user initials
export const getInitials = (name: string | undefined): string => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Storage helpers
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to localStorage');
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('Failed to remove from localStorage');
    }
  }
};

// Debounce function
export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
