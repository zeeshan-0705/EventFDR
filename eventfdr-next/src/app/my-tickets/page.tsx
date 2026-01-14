'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { 
  Ticket, Calendar, MapPin, QrCode, Download, 
  X, ExternalLink, AlertTriangle, ChevronDown, ChevronUp 
} from 'lucide-react';
import styles from './page.module.css';

export default function MyTicketsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { getUserRegistrations, cancelRegistration, isLoading } = useEvents();
  const { success, error } = useToast();
  
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className={styles.ticketsAuthRequired}>
        <div className={styles.authRequiredContent}>
          <Ticket size={64} />
          <h2>Sign in to view your tickets</h2>
          <p>Please log in to access your event registrations</p>
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const registrations = user ? getUserRegistrations(user.id) : [];

  const handleCancel = async (registrationId: string) => {
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

  const toggleExpand = (id: string) => {
    setExpandedTicket(expandedTicket === id ? null : id);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.ticketsPage}>
      <div className={styles.ticketsHeader}>
        <div className="container">
          <div className={styles.ticketsHeaderContent}>
            <div className={styles.ticketsIcon}>
              <Ticket size={28} />
            </div>
            <div>
              <h1>My Tickets</h1>
              <p>Manage your event registrations</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.ticketsContent} container`}>
        {registrations.length > 0 ? (
          <div className={styles.ticketsList}>
            {registrations.map((registration) => (
              <div key={registration.id} className={styles.ticketItem}>
                <div className={styles.ticketMain} onClick={() => toggleExpand(registration.id)}>
                  <div className={styles.ticketImage}>
                    <img src={registration.eventImage} alt={registration.eventTitle} />
                  </div>

                  <div className={styles.ticketInfo}>
                    <div className={styles.ticketHeaderRow}>
                      <h3 className={styles.ticketTitle}>{registration.eventTitle}</h3>
                      <span className={`${styles.ticketStatus} ${styles[registration.status]}`}>
                        {registration.status}
                      </span>
                    </div>

                    <div className={styles.ticketMeta}>
                      <div className={styles.ticketMetaItem}>
                        <Calendar size={16} />
                        <span>{formatDate(registration.eventDate)}</span>
                      </div>
                      <div className={styles.ticketMetaItem}>
                        <MapPin size={16} />
                        <span>{registration.eventVenue}, {registration.eventCity}</span>
                      </div>
                      <div className={styles.ticketMetaItem}>
                        <Ticket size={16} />
                        <span>{registration.tickets} ticket{registration.tickets > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className={styles.ticketFooterRow}>
                      <div className={styles.ticketCode}>
                        <QrCode size={16} />
                        <span>{registration.ticketCode}</span>
                      </div>
                      <button className={styles.ticketExpandBtn}>
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
                  <div className={styles.ticketDetails}>
                    <div className={styles.ticketDetailsGrid}>
                      <div className={styles.ticketDetailItem}>
                        <label>Booking ID</label>
                        <span>{registration.id}</span>
                      </div>
                      <div className={styles.ticketDetailItem}>
                        <label>Ticket Code</label>
                        <span>{registration.ticketCode}</span>
                      </div>
                      <div className={styles.ticketDetailItem}>
                        <label>Total Amount</label>
                        <span>{formatCurrency(registration.totalAmount)}</span>
                      </div>
                      <div className={styles.ticketDetailItem}>
                        <label>Payment Method</label>
                        <span style={{ textTransform: 'capitalize' }}>{registration.paymentMethod}</span>
                      </div>
                      <div className={styles.ticketDetailItem}>
                        <label>Payment Status</label>
                        <span className="badge badge-success">{registration.paymentStatus}</span>
                      </div>
                      <div className={styles.ticketDetailItem}>
                        <label>Booked On</label>
                        <span>{formatDate(registration.createdAt)}</span>
                      </div>
                    </div>

                    <div className={styles.ticketActions}>
                      <Link 
                        href={`/event/${registration.eventId}`} 
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
          <div className={styles.ticketsEmpty}>
            <div className={styles.emptyIcon}>
              <Ticket size={64} />
            </div>
            <h2>No Tickets Yet</h2>
            <p>You haven&apos;t registered for any events yet. Browse our events and find something interesting!</p>
            <Link href="/events" className="btn btn-primary btn-lg">
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCancelModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Cancel Registration</h3>
              <button onClick={() => setShowCancelModal(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.cancelWarning}>
                <AlertTriangle size={48} />
                <p>Are you sure you want to cancel this registration?</p>
                <p className={styles.cancelNote}>This action cannot be undone. Your payment will be refunded within 5-7 business days.</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
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
}
