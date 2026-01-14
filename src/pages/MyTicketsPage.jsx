import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import { 
  Ticket, Calendar, MapPin, Clock, QrCode, Download, 
  X, ExternalLink, AlertTriangle, ChevronDown, ChevronUp 
} from 'lucide-react';
import './MyTicketsPage.css';

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getUserRegistrations, cancelRegistration, isLoading } = useEvents();
  const { success, error } = useToast();
  
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="tickets-auth-required">
        <div className="auth-required-content">
          <Ticket size={64} />
          <h2>Sign in to view your tickets</h2>
          <p>Please log in to access your event registrations</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const registrations = getUserRegistrations(user.id);

  const handleCancel = async (registrationId) => {
    setCancellingId(registrationId);
    const result = await cancelRegistration(registrationId);
    
    if (result.success) {
      success('Registration cancelled successfully');
    } else {
      error(result.error || 'Failed to cancel registration');
    }
    
    setCancellingId(null);
    setShowCancelModal(null);
  };

  const toggleExpand = (id) => {
    setExpandedTicket(expandedTicket === id ? null : id);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div className="container">
          <div className="tickets-header-content">
            <div className="tickets-icon">
              <Ticket size={28} />
            </div>
            <div>
              <h1>My Tickets</h1>
              <p>Manage your event registrations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tickets-content container">
        {registrations.length > 0 ? (
          <div className="tickets-list">
            {registrations.map((registration) => (
              <div key={registration.id} className="ticket-item">
                <div className="ticket-main" onClick={() => toggleExpand(registration.id)}>
                  <div className="ticket-image">
                    <img src={registration.eventImage} alt={registration.eventTitle} />
                  </div>

                  <div className="ticket-info">
                    <div className="ticket-header-row">
                      <h3 className="ticket-title">{registration.eventTitle}</h3>
                      <span className={`ticket-status ${registration.status}`}>
                        {registration.status}
                      </span>
                    </div>

                    <div className="ticket-meta">
                      <div className="ticket-meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(registration.eventDate)}</span>
                      </div>
                      <div className="ticket-meta-item">
                        <MapPin size={16} />
                        <span>{registration.eventVenue}, {registration.eventCity}</span>
                      </div>
                      <div className="ticket-meta-item">
                        <Ticket size={16} />
                        <span>{registration.tickets} ticket{registration.tickets > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="ticket-footer-row">
                      <div className="ticket-code">
                        <QrCode size={16} />
                        <span>{registration.ticketCode}</span>
                      </div>
                      <button className="ticket-expand-btn">
                        {expandedTicket === registration.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedTicket === registration.id && (
                  <div className="ticket-details">
                    <div className="ticket-details-grid">
                      <div className="ticket-detail-item">
                        <label>Booking ID</label>
                        <span>{registration.id}</span>
                      </div>
                      <div className="ticket-detail-item">
                        <label>Ticket Code</label>
                        <span>{registration.ticketCode}</span>
                      </div>
                      <div className="ticket-detail-item">
                        <label>Total Amount</label>
                        <span>{formatCurrency(registration.totalAmount)}</span>
                      </div>
                      <div className="ticket-detail-item">
                        <label>Payment Method</label>
                        <span style={{ textTransform: 'capitalize' }}>{registration.paymentMethod}</span>
                      </div>
                      <div className="ticket-detail-item">
                        <label>Payment Status</label>
                        <span className="badge badge-success">{registration.paymentStatus}</span>
                      </div>
                      <div className="ticket-detail-item">
                        <label>Booked On</label>
                        <span>{formatDate(registration.createdAt)}</span>
                      </div>
                    </div>

                    <div className="ticket-actions">
                      <Link 
                        to={`/event/${registration.eventId}`} 
                        className="btn btn-secondary"
                      >
                        <ExternalLink size={16} />
                        View Event
                      </Link>
                      <button className="btn btn-secondary">
                        <Download size={16} />
                        Download Ticket
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCancelModal(registration.id);
                        }}
                        disabled={cancellingId === registration.id}
                      >
                        <X size={16} />
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="tickets-empty">
            <div className="empty-icon">
              <Ticket size={64} />
            </div>
            <h2>No Tickets Yet</h2>
            <p>You haven't registered for any events yet. Browse our events and find something interesting!</p>
            <Link to="/events" className="btn btn-primary btn-lg">
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cancel Registration</h3>
              <button 
                className="btn btn-ghost btn-icon"
                onClick={() => setShowCancelModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="cancel-warning">
                <AlertTriangle size={48} />
                <p>Are you sure you want to cancel this registration?</p>
                <p className="cancel-note">This action cannot be undone. Your payment will be refunded within 5-7 business days.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCancelModal(null)}
              >
                Keep Registration
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleCancel(showCancelModal)}
                disabled={cancellingId === showCancelModal}
              >
                {cancellingId === showCancelModal ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
