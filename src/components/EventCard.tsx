'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDateRange, getAvailability, getEventStatus } from '@/utils/helpers';
import { Event } from '@/types';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const EventCard = ({ event, featured = false }: EventCardProps) => {
  const availability = getAvailability(event);
  const status = getEventStatus(event);

  return (
    <Link 
      href={`/event/${event.id}`} 
      className={`${styles.eventCard} ${featured ? styles.eventCardFeatured : ''}`}
    >
      <div className={styles.eventCardImageContainer}>
        <img 
          src={event.image} 
          alt={event.title}
          className={styles.eventCardImage}
          loading="lazy"
        />
        <div className={styles.eventCardOverlay}>
          <span className={`badge ${status.color}`}>{status.label}</span>
          {event.featured && (
            <span className={styles.eventCardFeaturedBadge}>Featured</span>
          )}
        </div>
        <div className={styles.eventCardCategory}>{event.category}</div>
      </div>

      <div className={styles.eventCardContent}>
        <div className={styles.eventCardHeader}>
          <h3 className={styles.eventCardTitle}>{event.title}</h3>
          <p className={styles.eventCardDescription}>{event.shortDescription}</p>
        </div>

        <div className={styles.eventCardMeta}>
          <div className={styles.eventCardMetaItem}>
            <Calendar size={16} />
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
          <div className={styles.eventCardMetaItem}>
            <MapPin size={16} />
            <span>{event.city}</span>
          </div>
          <div className={styles.eventCardMetaItem}>
            <Users size={16} />
            <span>{availability.available} spots left</span>
          </div>
        </div>

        <div className={styles.eventCardFooter}>
          <div className={styles.eventCardPrice}>
            <span className={styles.eventCardPriceLabel}>From</span>
            <span className={styles.eventCardPriceValue}>{formatCurrency(event.price)}</span>
          </div>
          <div className={styles.eventCardAction}>
            <span>View Details</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Availability indicator */}
        <div className={styles.eventCardAvailability}>
          <div className={styles.eventCardAvailabilityBar}>
            <div 
              className={`${styles.eventCardAvailabilityFill} ${styles[availability.status]}`}
              style={{ width: `${100 - availability.percentage}%` }}
            />
          </div>
          <span className={styles.eventCardAvailabilityText}>
            {Math.round(100 - availability.percentage)}% booked
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
