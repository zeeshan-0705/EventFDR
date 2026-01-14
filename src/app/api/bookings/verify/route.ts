/**
 * Payment Verification API Route
 * POST /api/bookings/verify - Verify Razorpay payment and update booking status
 * 
 * In production, you would verify the payment signature using Razorpay
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// In production, verify Razorpay payment signature
// const crypto = require('crypto');
// function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
//   const body = orderId + "|" + paymentId;
//   const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//     .update(body.toString())
//     .digest('hex');
//   return expectedSignature === signature;
// }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, paymentId, orderId, signature } = body;

    if (!bookingId || !paymentId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and Payment ID are required' },
        { status: 400 }
      );
    }

    // In production, verify the signature here
    // const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    // if (!isValid) {
    //   return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    // }

    // Update booking status to paid
    const updatedBooking = await db.bookings.updatePaymentStatus(bookingId, 'paid', paymentId);

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update event registration count
    await db.events.incrementRegistrations(updatedBooking.eventId, updatedBooking.tickets);

    return NextResponse.json({ 
      success: true, 
      data: updatedBooking,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
