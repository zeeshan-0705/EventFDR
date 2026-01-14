import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, ArrowRight, Calendar, MapPin, Users, Star, 
  Sparkles, Zap, Shield, TrendingUp 
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { events, featuredEvents, isLoading } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { icon: Calendar, value: '500+', label: 'Events Hosted' },
    { icon: Users, value: '50K+', label: 'Happy Attendees' },
    { icon: MapPin, value: '25+', label: 'Cities Covered' },
    { icon: Star, value: '4.9', label: 'Average Rating' }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Discover Amazing Events',
      description: 'Find concerts, conferences, workshops, and more happening near you.'
    },
    {
      icon: Zap,
      title: 'Quick & Easy Registration',
      description: 'Register for events in seconds with our streamlined booking process.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your payment information is always protected with industry-standard encryption.'
    },
    {
      icon: TrendingUp,
      title: 'Track Your Events',
      description: 'Manage all your registrations and tickets in one convenient place.'
    }
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient-1" />
          <div className="hero-gradient-2" />
          <div className="hero-particles" />
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fade-in-down">
            <Sparkles size={14} />
            <span>Discover Extraordinary Experiences</span>
          </div>

          <h1 className="hero-title animate-fade-in-up">
            Find & Attend
            <span className="gradient-text"> Amazing Events</span>
            <br />Near You
          </h1>

          <p className="hero-description animate-fade-in-up stagger-1">
            Discover concerts, conferences, workshops, and more. 
            Register with ease and never miss out on unforgettable experiences.
          </p>

          <form className="hero-search animate-scale-in stagger-2" onSubmit={handleSearch}>
            <div className="hero-search-input-wrapper">
              <Search className="hero-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for events, venues, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              <span>Search Events</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="hero-stats animate-fade-in-up stagger-3">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <stat.icon size={20} className="hero-stat-icon" />
                <div className="hero-stat-content">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-badge">
                <Star size={14} />
                Featured
              </span>
              <h2 className="section-title">Featured Events</h2>
              <p className="section-description">
                Handpicked events you don't want to miss
              </p>
            </div>
            <Link to="/events" className="btn btn-secondary">
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="featured-grid">
            {featuredEvents.slice(0, 4).map((event, index) => (
              <div key={event.id} className={`animate-fade-in-up stagger-${index + 1}`}>
                <EventCard event={event} featured />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header section-header-center">
            <span className="section-badge">
              <Zap size={14} />
              Why Choose Us
            </span>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-description">
              We make discovering and attending events simple and enjoyable
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card animate-fade-in-up stagger-${index + 1}`}>
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section upcoming-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-badge">
                <Calendar size={14} />
                Coming Soon
              </span>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-description">
                Don't miss these exciting upcoming events
              </p>
            </div>
            <Link to="/events" className="btn btn-secondary">
              Browse All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="events-grid">
            {events.slice(0, 6).map((event, index) => (
              <div key={event.id} className={`animate-fade-in-up stagger-${(index % 3) + 1}`}>
                <EventCard event={event} />
              </div>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/events" className="btn btn-primary btn-lg">
              Explore All Events
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Create Your Own Event?</h2>
              <p className="cta-description">
                Start hosting amazing events and reach thousands of attendees
              </p>
            </div>
            <Link to="/create-event" className="btn btn-primary btn-lg">
              Create Event
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Calendar size={24} />
                <span>Event<span className="accent">FDR</span></span>
              </div>
              <p className="footer-tagline">
                Discover, Register, Experience
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-link-group">
                <h4>Explore</h4>
                <Link to="/events">All Events</Link>
                <Link to="/events?category=Technology">Tech Events</Link>
                <Link to="/events?category=Music">Music Events</Link>
              </div>
              <div className="footer-link-group">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 EventFDR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
