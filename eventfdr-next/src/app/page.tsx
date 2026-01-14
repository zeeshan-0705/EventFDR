'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/contexts/EventContext';
import EventCard from '@/components/EventCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Search, Calendar, MapPin, CreditCard, Shield, 
  Users, Sparkles, ArrowRight, ChevronRight 
} from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const { featuredEvents, isLoading } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'Discover Events',
      description: 'Find events that match your interests from concerts to conferences.'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your tickets in seconds with our streamlined process.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade security.'
    },
    {
      icon: Shield,
      title: 'Verified Events',
      description: 'All events are verified for authenticity and quality.'
    }
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient1} />
          <div className={styles.heroGradient2} />
        </div>

        <div className={`${styles.heroContent} container`}>
          <div className={styles.heroTag}>
            <Sparkles size={16} />
            <span>Discover Extraordinary Experiences</span>
          </div>

          <h1 className={styles.heroTitle}>
            Find & Attend <span className={styles.heroHighlight}>Amazing Events</span>
            <br />Near You
          </h1>

          <p className={styles.heroSubtitle}>
            Discover concerts, conferences, workshops, and more. Register with ease 
            and never miss out on unforgettable experiences.
          </p>

          <form onSubmit={handleSearch} className={styles.heroSearch}>
            <div className={styles.heroSearchInput}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search for events, venues, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Search Events
              <ArrowRight size={18} />
            </button>
          </form>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>10K+</span>
              <span className={styles.heroStatLabel}>Events</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>50K+</span>
              <span className={styles.heroStatLabel}>Happy Attendees</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>100+</span>
              <span className={styles.heroStatLabel}>Cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Events</h2>
              <p className={styles.sectionSubtitle}>
                Don&apos;t miss these trending events
              </p>
            </div>
            <Link href="/events" className={styles.sectionLink}>
              View All Events
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className={styles.eventsGrid}>
            {featuredEvents.slice(0, 4).map(event => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderCenter}>
              <h2 className={styles.sectionTitle}>Why Choose EventFDR?</h2>
              <p className={styles.sectionSubtitle}>
                The easiest way to find and book amazing events
              </p>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon size={24} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <Users size={48} className={styles.ctaIcon} />
              <h2 className={styles.ctaTitle}>Ready to Host Your Own Event?</h2>
              <p className={styles.ctaDescription}>
                Create and manage events with our easy-to-use platform. 
                Reach thousands of potential attendees.
              </p>
              <Link href="/create-event" className="btn btn-primary btn-lg">
                Create Event
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo}>
                <Calendar size={28} />
                <span>Event<span className="accent">FDR</span></span>
              </Link>
              <p className={styles.footerTagline}>
                Your gateway to amazing experiences
              </p>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerLinkGroup}>
                <h4>Explore</h4>
                <Link href="/events">All Events</Link>
                <Link href="/events?category=Technology">Tech Events</Link>
                <Link href="/events?category=Music">Music Events</Link>
                <Link href="/events?category=Business">Business Events</Link>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>For Organizers</h4>
                <Link href="/create-event">Create Event</Link>
                <Link href="#">Pricing</Link>
                <Link href="#">Resources</Link>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>Support</h4>
                <Link href="#">Help Center</Link>
                <Link href="#">Contact Us</Link>
                <Link href="#">Terms of Service</Link>
                <Link href="#">Privacy Policy</Link>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} EventFDR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
