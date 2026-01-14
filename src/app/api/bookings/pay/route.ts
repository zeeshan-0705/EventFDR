/**
 * Payment API Route
 * POST /api/bookings/pay - Initiate payment for a booking
 * This creates a Razorpay order and returns the order details
 * 
 * In production, you would:
 * 1. Install: npm install razorpay
 * 2. Set environment variables: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 * 3. Use actual Razorpay SDK to create orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simulated Razorpay order creation
// In production, replace with actual Razorpay SDK
async function createRazorpayOrder(amount: number, bookingId: string) {
  // This is a simulation - in production use:
  // const Razorpay = require('razorpay');
  // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: bookingId });
  
  return {
    id: 'order_' + Date.now(),
    entity: 'order',
    amount: amount * 100, // Razorpay uses paise
    currency: 'INR',
    receipt: bookingId,
    status: 'created',
    created_at: Date.now()
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and amount are required' },
        { status: 400 }
      );
    }

    // Verify booking exists
    const booking = await db.bookings.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Create Razorpay order
    const order = await createRazorpayOrder(amount, bookingId);

    return NextResponse.json({ 
      success: true, 
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: bookingId,
        // In production, include your Razorpay key_id here
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo'
      }
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
