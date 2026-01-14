'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  formatCurrency, formatDateRange, formatTime, 
  getAvailability, getDaysUntil 
} from '@/utils/helpers';
import { 
  Calendar, MapPin, Clock, Users, Tag, ArrowLeft,
  CheckCircle, Ticket, CreditCard, Smartphone, Building,
  Share2, Heart, Minus, Plus, X
} from 'lucide-react';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const { eventId } = use(params);
  const router = useRouter();
  const { getEventById, registerForEvent, isUserRegistered, isLoading } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [event, setEvent] = useState<ReturnType<typeof getEventById>>(undefined);
  const [activeTab, setActiveTab] = useState('overview');
  const [ticketCount, setTicketCount] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundEvent = getEventById(eventId);
    setEvent(foundEvent);
  }, [eventId, getEventById]);

  if (isLoading || !event) {
    return <LoadingSpinner fullScreen />;
  }

  const availability = getAvailability(event);
  const daysUntil = getDaysUntil(event.date);
  const totalPrice = event.price * ticketCount;
  const isRegistered = user ? isUserRegistered(event.id, user.id) : false;

  const handleRegister = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=/event/${event.id}`);
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!user) return;
    
    setIsProcessing(true);
    
    const result = await registerForEvent(event.id, user.id, {
      tickets: ticketCount,
      totalAmount: totalPrice,
      paymentMethod,
      attendeeNames: [user.name],
      email: user.email,
      phone: user.phone || ''
    });
    
    setIsProcessing(false);
    setShowPaymentModal(false);
    
    if (result.success) {
      success('Registration successful! Check your tickets.');
      router.push('/my-tickets');
    } else {
      error(result.error || 'Registration failed');
    }
  };

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
    { id: 'upi', icon: Smartphone, label: 'UPI Payment' },
    { id: 'netbanking', icon: Building, label: 'Net Banking' }
  ];

  return (
    <div className={styles.eventPage}>
      {/* Hero Section */}
      <div className={styles.eventHero}>
        <img src={event.image} alt={event.title} className={styles.eventHeroImage} />
        <div className={styles.eventHeroOverlay} />
        <div className={styles.eventHeroContent}>
          <Link href="/events" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </Link>
          <div className={styles.eventHeroInfo}>
            <span className={styles.eventCategory}>{event.category}</span>
            <h1 className={styles.eventTitle}>{event.title}</h1>
            <p className={styles.eventShortDesc}>{event.shortDescription}</p>
          </div>
        </div>
      </div>

      <div className={`${styles.eventContent} container`}>
        <div className={styles.eventMain}>
          {/* Quick Info */}
          <div className={styles.eventQuickInfo}>
            <div className={styles.quickInfoItem}>
              <Calendar size={20} />
              <div>
                <span className={styles.quickInfoLabel}>Date</span>
                <span className={styles.quickInfoValue}>{formatDateRange(event.date, event.endDate)}</span>
              </div>
            </div>
            <div className={styles.quickInfoItem}>
              <Clock size={20} />
              <div>
                <span className={styles.quickInfoLabel}>Time</span>
                <span className={styles.quickInfoValue}>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
              </div>
            </div>
            <div className={styles.quickInfoItem}>
              <MapPin size={20} />
              <div>
                <span className={styles.quickInfoLabel}>Venue</span>
                <span className={styles.quickInfoValue}>{event.venue}, {event.city}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.eventTabs}>
            <button 
              className={`${styles.eventTab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`${styles.eventTab} ${activeTab === 'schedule' ? styles.active : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button 
              className={`${styles.eventTab} ${activeTab === 'venue' ? styles.active : ''}`}
              onClick={() => setActiveTab('venue')}
            >
              Venue
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <h2>About This Event</h2>
                <p>{event.description}</p>

                {event.highlights && event.highlights.length > 0 && (
                  <div className={styles.highlights}>
                    <h3>Event Highlights</h3>
                    <ul>
                      {event.highlights.map((highlight, index) => (
                        <li key={index}>
                          <CheckCircle size={18} />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div className={styles.tags}>
                    <h3>Tags</h3>
                    <div className={styles.tagsList}>
                      {event.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.organizer}>
                  <h3>Organizer</h3>
                  <div className={styles.organizerCard}>
                    <div className={styles.organizerAvatar}>
                      {event.organizer.name.charAt(0)}
                    </div>
                    <div className={styles.organizerInfo}>
                      <span className={styles.organizerName}>
                        {event.organizer.name}
                        {event.organizer.verified && (
                          <CheckCircle size={14} className={styles.verifiedBadge} />
                        )}
                      </span>
                      <span className={styles.organizerEmail}>{event.organizer.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className={styles.schedule}>
                <h2>Event Schedule</h2>
                <div className={styles.scheduleList}>
                  {event.schedule.map((item, index) => (
                    <div key={index} className={styles.scheduleItem}>
                      <div className={styles.scheduleDay}>{item.day}</div>
                      <div className={styles.scheduleDetails}>
                        <h4>{item.title}</h4>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'venue' && (
              <div className={styles.venue}>
                <h2>Venue Details</h2>
                <div className={styles.venueCard}>
                  <h3>{event.venue}</h3>
                  <p>{event.address}</p>
                  <p>{event.city}, {event.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Sidebar */}
        <div className={styles.eventSidebar}>
          <div className={styles.ticketCard}>
            <div className={styles.ticketPrice}>
              <span className={styles.priceLabel}>Price per ticket</span>
              <span className={styles.priceValue}>{formatCurrency(event.price)}</span>
            </div>

            <div className={styles.ticketAvailability}>
              <Users size={18} />
              <span className={availability.status === 'low' ? styles.low : ''}>
                {availability.available} spots left
              </span>
            </div>

            <div className={styles.ticketProgress}>
              <div 
                className={styles.ticketProgressBar}
                style={{ width: `${100 - availability.percentage}%` }}
              />
            </div>

            <div className={styles.eventCountdown}>
              <Calendar size={18} />
              <span>Event in {daysUntil}</span>
            </div>

            {isRegistered ? (
              <div className={styles.alreadyRegistered}>
                <CheckCircle size={20} />
                <span>You&apos;re registered!</span>
              </div>
            ) : (
              <>
                <div className={styles.ticketSelector}>
                  <label>Number of Tickets</label>
                  <div className={styles.ticketCounter}>
                    <button 
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span>{ticketCount}</span>
                    <button 
                      onClick={() => setTicketCount(Math.min(availability.available, ticketCount + 1))}
                      disabled={ticketCount >= availability.available}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className={styles.ticketTotal}>
                  <span>Total</span>
                  <span className={styles.totalAmount}>{formatCurrency(totalPrice)}</span>
                </div>

                <button 
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleRegister}
                  disabled={availability.available === 0}
                >
                  <Ticket size={18} />
                  Register Now
                </button>
              </>
            )}
          </div>

          <div className={styles.shareActions}>
            <button className="btn btn-secondary">
              <Share2 size={18} />
              Share
            </button>
            <button className="btn btn-secondary">
              <Heart size={18} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Complete Your Registration</h3>
              <button onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.orderSummary}>
                <div className={styles.orderEvent}>{event.title}</div>
                <div className={styles.orderDetails}>
                  <span>Tickets</span>
                  <span>{ticketCount} × {formatCurrency(event.price)}</span>
                </div>
                <div className={`${styles.orderDetails} ${styles.orderTotal}`}>
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className={styles.paymentMethods}>
                <h4>Select Payment Method</h4>
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    className={styles.paymentOption}
                    onClick={() => handlePayment(method.id)}
                    disabled={isProcessing}
                  >
                    <method.icon size={20} />
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
