# 🔧 Environment & Configuration Guide

This guide explains how to configure EventFDR for production use.

## 📋 Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

```bash
# ========== PAYMENTS - RAZORPAY ==========
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Public key for frontend
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# ========== DATABASE - SUPABASE (Optional) ==========
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🏦 Setting Up Razorpay

1. **Create Account**: Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. **Get API Keys**: Navigate to Settings → API Keys
3. **Test Mode**: Use test keys for development (`rzp_test_...`)
4. **Add to env**: Copy `Key ID` and `Key Secret` to your `.env.local`

### Testing Payments

Use these test cards in Razorpay test mode:

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits

---

## 🗄️ Setting Up Supabase (Database)

1. **Create Project**: Go to [Supabase](https://supabase.com) and create a new project
2. **Get Credentials**: Find your API URL and keys in Project Settings → API
3. **Create Tables**: Run the SQL schema below

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT,
  date DATE NOT NULL,
  time TIME,
  end_date DATE,
  end_time TIME,
  venue TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  image TEXT,
  price INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  capacity INTEGER DEFAULT 100,
  registered INTEGER DEFAULT 0,
  organizer_name TEXT,
  organizer_email TEXT,
  organizer_verified BOOLEAN DEFAULT false,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'upcoming',
  highlights TEXT[],
  schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  tickets INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method TEXT,
  attendee_names TEXT[],
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  ticket_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);
```

---

## 🔒 Security Notes

1. **Never commit** `.env.local` to version control
2. **Use HTTPS** in production
3. **Validate payments** on the server side
4. **Hash passwords** using bcrypt (already handled in production)
5. **Rate limit** API endpoints
