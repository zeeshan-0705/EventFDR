/**
 * Bookings API Route
 * GET /api/bookings - Get user's bookings
 * POST /api/bookings - Create a new booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const bookings = await db.bookings.findByUserId(userId);

    return NextResponse.json({ 
      success: true, 
      data: bookings,
      count: bookings.length 
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.eventId || !body.userId || !body.tickets) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: eventId, userId, tickets' },
        { status: 400 }
      );
    }

    // Get event details
    const event = await db.events.findById(body.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check availability
    const available = event.capacity - event.registered;
    if (body.tickets > available) {
      return NextResponse.json(
        { success: false, error: `Only ${available} tickets available` },
        { status: 400 }
      );
    }

    // Create booking with event details
    const bookingData = {
      ...body,
      eventTitle: event.title,
      eventDate: event.date,
      eventImage: event.image,
      eventVenue: event.venue,
      eventCity: event.city,
      totalAmount: body.totalAmount || (event.price * body.tickets)
    };

    const newBooking = await db.bookings.create(bookingData);

    return NextResponse.json({ 
      success: true, 
      data: newBooking 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
