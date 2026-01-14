'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Trash2, Edit, Users, DollarSign, Search } from 'lucide-react';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

export default function AdminEventsPage() {
  const { events, deleteEvent, isLoading } = useEvents();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        Loading admin dashboard...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Filter events
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registered, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (event.registered * event.price), 0);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This cannot be undone.`)) {
      await deleteEvent(eventId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Event Dashboard</h1>
          <div className={styles.subtitle}>Welcome back, {user?.name}</div>
        </div>
        <Link href="/create-event" className="btn btn-primary">
          <Plus size={20} />
          Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon}`} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Events</h3>
            <div className={styles.statValue}>{totalEvents}</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon}`} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Registrations</h3>
            <div className={styles.statValue}>{totalRegistrations}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon}`} style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Estimated Revenue</h3>
            <div className={styles.statValue}>{formatCurrency(totalRevenue)}</div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
        />
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
      </div>

      <div className={styles.eventsTable}>
        <div className={styles.tableHeader}>
          <div>Event Details</div>
          <div>Date</div>
          <div>Category</div>
          <div>Price</div>
          <div>Registrations</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className={styles.eventRow}>
              <div className={styles.eventTitle}>
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  width={48} 
                  height={48} 
                  className={styles.eventImage}
                />
                <div className={styles.eventInfo}>
                  <h4>{event.title}</h4>
                  <div className={styles.status} style={{ 
                    color: event.status === 'upcoming' ? 'var(--success-400)' : 'var(--neutral-400)',
                    fontSize: '0.75rem'
                  }}>
                    {event.status}
                  </div>
                </div>
              </div>
              
              <div className={styles.eventDate}>
                {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                <div style={{ color: 'var(--neutral-500)', fontSize: '0.75rem' }}>{event.time}</div>
              </div>
              
              <div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{event.category}</span>
              </div>
              
              <div style={{ fontWeight: 600 }}>
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="progress" style={{ width: '80px', height: '6px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.8rem' }}>
                    {event.registered}/{event.capacity}
                  </span>
                </div>
              </div>
              
              <div className={styles.actions}>
                <Link href={`/event/${event.id}`} className={styles.actionBtn} title="View">
                  <Edit size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(event.id, event.title)} 
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--neutral-400)' }}>
            No events found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
