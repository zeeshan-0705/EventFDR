/**
 * Events API Route
 * GET /api/events - Get all events (with optional filters)
 * POST /api/events - Create a new event
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let events;

    if (featured === 'true') {
      events = await db.events.findFeatured();
    } else if (category && category !== 'All Events') {
      events = await db.events.findByCategory(category);
    } else {
      events = await db.events.findAll();
    }

    return NextResponse.json({ 
      success: true, 
      data: events,
      count: events.length 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.date || !body.venue) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, date, venue' },
        { status: 400 }
      );
    }

    const newEvent = await db.events.create(body);

    return NextResponse.json({ 
      success: true, 
      data: newEvent 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
