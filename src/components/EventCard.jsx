import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { formatCurrency, formatDateRange, getAvailability, getEventStatus } from '../utils/helpers';
import './EventCard.css';

const EventCard = ({ event, featured = false }) => {
  const availability = getAvailability(event);
  const status = getEventStatus(event);

  return (
    <Link 
      to={`/event/${event.id}`} 
      className={`event-card ${featured ? 'event-card-featured' : ''}`}
    >
      <div className="event-card-image-container">
        <img 
          src={event.image} 
          alt={event.title}
          className="event-card-image"
          loading="lazy"
        />
        <div className="event-card-overlay">
          <span className={`badge ${status.color}`}>{status.label}</span>
          {event.featured && (
            <span className="event-card-featured-badge">Featured</span>
          )}
        </div>
        <div className="event-card-category">{event.category}</div>
      </div>

      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-description">{event.shortDescription}</p>
        </div>

        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <Calendar size={16} />
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
          <div className="event-card-meta-item">
            <MapPin size={16} />
            <span>{event.city}</span>
          </div>
          <div className="event-card-meta-item">
            <Users size={16} />
            <span>{availability.available} spots left</span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="event-card-price">
            <span className="event-card-price-label">From</span>
            <span className="event-card-price-value">{formatCurrency(event.price)}</span>
          </div>
          <div className="event-card-action">
            <span>View Details</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Availability indicator */}
        <div className="event-card-availability">
          <div className="event-card-availability-bar">
            <div 
              className={`event-card-availability-fill ${availability.status}`}
              style={{ width: `${100 - availability.percentage}%` }}
            />
          </div>
          <span className="event-card-availability-text">
            {Math.round(100 - availability.percentage)}% booked
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
