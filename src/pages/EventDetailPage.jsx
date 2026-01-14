import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  formatCurrency, formatDateRange, formatTime, 
  getAvailability, getEventStatus, formatNumber, getDaysUntil 
} from '../utils/helpers';
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, Share2, 
  Heart, CheckCircle, Star, Ticket, CreditCard, Minus, Plus,
  Building, Mail, ExternalLink, Check
} from 'lucide-react';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById, isUserRegistered, registerForEvent, isLoading: eventLoading } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadEvent = () => {
      const eventData = getEventById(eventId);
      if (eventData) {
        setEvent(eventData);
      }
      setIsLoading(false);
    };

    if (!eventLoading) {
      loadEvent();
    }
  }, [eventId, getEventById, eventLoading]);

  if (isLoading || eventLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="btn btn-primary">
          <ArrowLeft size={18} />
          Back to Events
        </Link>
      </div>
    );
  }

  const availability = getAvailability(event);
  const status = getEventStatus(event);
  const isRegistered = user ? isUserRegistered(event.id, user.id) : false;
  const totalPrice = event.price * ticketCount;

  const handleTicketChange = (delta) => {
    const newCount = ticketCount + delta;
    if (newCount >= 1 && newCount <= Math.min(10, availability.available)) {
      setTicketCount(newCount);
    }
  };

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/event/${event.id}` } });
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentMethod) => {
    setIsRegistering(true);
    
    const registrationData = {
      tickets: ticketCount,
      totalAmount: totalPrice,
      paymentMethod,
      attendeeNames: [user.name],
      email: user.email,
      phone: user.phone || ''
    };

    const result = await registerForEvent(event.id, user.id, registrationData);
    
    if (result.success) {
      success('Registration successful! Check your tickets.');
      setShowPaymentModal(false);
      navigate('/my-tickets');
    } else {
      error(result.error || 'Registration failed. Please try again.');
    }
    
    setIsRegistering(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  return (
    <div className="event-detail-page">
      {/* Hero Section */}
      <div className="event-hero">
        <img src={event.image} alt={event.title} className="event-hero-image" />
        <div className="event-hero-overlay" />
        
        <div className="event-hero-content container">
          <Link to="/events" className="event-back-btn">
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </Link>

          <div className="event-hero-info">
            <div className="event-badges">
              <span className={`badge ${status.color}`}>{status.label}</span>
              <span className="badge badge-primary">{event.category}</span>
              {event.featured && (
                <span className="event-featured-badge">
                  <Star size={12} />
                  Featured
                </span>
              )}
            </div>

            <h1 className="event-hero-title">{event.title}</h1>
            
            <div className="event-hero-meta">
              <div className="event-meta-item">
                <Calendar size={18} />
                <span>{formatDateRange(event.date, event.endDate)}</span>
              </div>
              <div className="event-meta-item">
                <Clock size={18} />
                <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
              </div>
              <div className="event-meta-item">
                <MapPin size={18} />
                <span>{event.venue}, {event.city}</span>
              </div>
            </div>

            <div className="event-hero-actions">
              <button 
                className={`event-action-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="event-action-btn" onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="event-content container">
        <div className="event-main">
          {/* Tabs */}
          <div className="event-tabs">
            <button 
              className={`event-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`event-tab ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button 
              className={`event-tab ${activeTab === 'venue' ? 'active' : ''}`}
              onClick={() => setActiveTab('venue')}
            >
              Venue
            </button>
          </div>

          {/* Tab Content */}
          <div className="event-tab-content">
            {activeTab === 'overview' && (
              <div className="event-overview animate-fade-in">
                <div className="event-section">
                  <h2>About This Event</h2>
                  <p className="event-description">{event.description}</p>
                </div>

                <div className="event-section">
                  <h3>Event Highlights</h3>
                  <div className="event-highlights">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="event-highlight">
                        <CheckCircle size={18} className="highlight-icon" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="event-section">
                  <h3>Tags</h3>
                  <div className="event-tags">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="event-tag">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="event-section">
                  <h3>Organizer</h3>
                  <div className="event-organizer">
                    <div className="organizer-avatar">
                      <Building size={24} />
                    </div>
                    <div className="organizer-info">
                      <div className="organizer-name">
                        {event.organizer.name}
                        {event.organizer.verified && (
                          <Check size={16} className="verified-badge" />
                        )}
                      </div>
                      <a href={`mailto:${event.organizer.email}`} className="organizer-email">
                        <Mail size={14} />
                        {event.organizer.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="event-schedule animate-fade-in">
                <h2>Event Schedule</h2>
                <div className="schedule-items">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                      <div className="schedule-time">
                        <span className="schedule-day">{item.day}</span>
                        <span className="schedule-hours">{item.time}</span>
                      </div>
                      <div className="schedule-content">
                        <h4>{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'venue' && (
              <div className="event-venue animate-fade-in">
                <h2>Venue Details</h2>
                <div className="venue-card">
                  <div className="venue-info">
                    <h3>{event.venue}</h3>
                    <p>{event.address}</p>
                    <p>{event.city}, {event.country}</p>
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <MapPin size={16} />
                    View on Map
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Ticket Purchase */}
        <div className="event-sidebar">
          <div className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-price">
                <span className="price-label">Price</span>
                <span className="price-value">{formatCurrency(event.price)}</span>
                <span className="price-per">per ticket</span>
              </div>
            </div>

            <div className="ticket-availability">
              <div className="availability-header">
                <Users size={18} />
                <span>{formatNumber(availability.available)} spots left</span>
              </div>
              <div className="availability-bar">
                <div 
                  className={`availability-fill ${availability.status}`}
                  style={{ width: `${100 - availability.percentage}%` }}
                />
              </div>
              <p className="availability-text">
                {formatNumber(event.registered)} of {formatNumber(event.capacity)} registered
              </p>
            </div>

            <div className="ticket-countdown">
              <Calendar size={16} />
              <span>Event in <strong>{getDaysUntil(event.date)}</strong></span>
            </div>

            {isRegistered ? (
              <div className="ticket-registered">
                <CheckCircle size={24} />
                <p>You're registered for this event!</p>
                <Link to="/my-tickets" className="btn btn-secondary w-full">
                  View Your Tickets
                </Link>
              </div>
            ) : availability.available > 0 ? (
              <>
                <div className="ticket-quantity">
                  <label>Number of Tickets</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleTicketChange(-1)}
                      disabled={ticketCount <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="quantity-value">{ticketCount}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleTicketChange(1)}
                      disabled={ticketCount >= Math.min(10, availability.available)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="ticket-total">
                  <span>Total</span>
                  <span className="total-value">{formatCurrency(totalPrice)}</span>
                </div>

                <button 
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  <Ticket size={20} />
                  {isRegistering ? 'Processing...' : 'Register Now'}
                </button>
              </>
            ) : (
              <div className="ticket-soldout">
                <p>This event is sold out</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Complete Your Registration</h3>
              <button 
                className="btn btn-ghost btn-icon"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="payment-summary">
                <h4>{event.title}</h4>
                <div className="payment-details">
                  <div className="payment-row">
                    <span>Tickets</span>
                    <span>{ticketCount} × {formatCurrency(event.price)}</span>
                  </div>
                  <div className="payment-row total">
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="payment-methods">
                <h4>Select Payment Method</h4>
                <div className="payment-options">
                  <button 
                    className="payment-option"
                    onClick={() => handlePayment('card')}
                    disabled={isRegistering}
                  >
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </button>
                  <button 
                    className="payment-option"
                    onClick={() => handlePayment('upi')}
                    disabled={isRegistering}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" width={40} />
                    <span>UPI Payment</span>
                  </button>
                  <button 
                    className="payment-option"
                    onClick={() => handlePayment('netbanking')}
                    disabled={isRegistering}
                  >
                    <Building size={24} />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {isRegistering && (
                <div className="payment-processing">
                  <LoadingSpinner size="sm" />
                  <span>Processing your payment...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
