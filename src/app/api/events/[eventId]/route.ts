/**
 * Single Event API Route
 * GET /api/events/[eventId] - Get a specific event
 * PUT /api/events/[eventId] - Update an event
 * DELETE /api/events/[eventId] - Delete an event
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: Promise<{ eventId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { eventId } = await params;
    const event = await db.events.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: event 
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    
    const updatedEvent = await db.events.update(eventId, body);

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedEvent 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { eventId } = await params;
    const deleted = await db.events.delete(eventId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
