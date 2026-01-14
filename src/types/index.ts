// Event Types for the EventFDR Application

export interface Organizer {
  name: string;
  email: string;
  verified: boolean;
}

export interface ScheduleItem {
  day: string;
  title: string;
  time: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  image: string;
  price: number;
  currency: string;
  capacity: number;
  registered: number;
  organizer: Organizer;
  tags: string[];
  featured: boolean;
  status: string;
  highlights: string[];
  schedule: ScheduleItem[];
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  eventTitle: string;
  eventDate: string;
  eventImage: string;
  eventVenue: string;
  eventCity: string;
  tickets: number;
  totalAmount: number;
  paymentMethod: string;
  attendeeNames: string[];
  email: string;
  phone: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  ticketCode: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string | null;
  password?: string;
  createdAt: string;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface EventFilters {
  query?: string;
  category?: string;
  city?: string;
  priceRange?: PriceRange;
  dateFrom?: string | null;
  dateTo?: string | null;
}
