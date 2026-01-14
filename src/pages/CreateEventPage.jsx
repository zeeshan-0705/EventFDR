import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { eventCategories, cities } from '../data/mockEvents';
import { 
  Calendar, MapPin, Clock, DollarSign, Users, Image, 
  Tag, FileText, Plus, ArrowLeft, CheckCircle 
} from 'lucide-react';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { addEvent, isLoading } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    date: '',
    time: '09:00',
    endDate: '',
    endTime: '18:00',
    venue: '',
    address: '',
    city: '',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    price: 0,
    currency: 'INR',
    capacity: 100,
    tags: '',
    featured: false,
    highlights: ['', '', '', '', ''],
    organizer: {
      name: user?.name || '',
      email: user?.email || '',
      verified: false
    }
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('highlight-')) {
      const index = parseInt(name.split('-')[1]);
      const newHighlights = [...formData.highlights];
      newHighlights[index] = value;
      setFormData(prev => ({ ...prev, highlights: newHighlights }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'Event title is required';
      if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required';
      if (!formData.description.trim()) errors.description = 'Description is required';
      if (!formData.category) errors.category = 'Category is required';
    }
    
    if (step === 2) {
      if (!formData.date) errors.date = 'Start date is required';
      if (!formData.endDate) errors.endDate = 'End date is required';
      if (formData.date && formData.endDate && formData.date > formData.endDate) {
        errors.endDate = 'End date must be after start date';
      }
      if (!formData.venue.trim()) errors.venue = 'Venue is required';
      if (!formData.city) errors.city = 'City is required';
    }
    
    if (step === 3) {
      if (formData.price < 0) errors.price = 'Price cannot be negative';
      if (formData.capacity < 1) errors.capacity = 'Capacity must be at least 1';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    const eventData = {
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      highlights: formData.highlights.filter(h => h.trim()),
      schedule: [
        { day: 'Day 1', title: 'Main Event', time: `${formData.time} - ${formData.endTime}` }
      ]
    };
    
    const result = await addEvent(eventData);
    
    if (result.success) {
      success('Event created successfully!');
      navigate(`/event/${result.event.id}`);
    } else {
      error(result.error || 'Failed to create event');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-event-auth-required">
        <div className="auth-required-content">
          <Calendar size={64} />
          <h2>Sign in to create events</h2>
          <p>Please log in to create and manage your events</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Date & Venue' },
    { number: 3, title: 'Pricing' },
    { number: 4, title: 'Review' }
  ];

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1>Create New Event</h1>
          <p>Fill in the details to create your event</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps container">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-number">
              {currentStep > step.number ? <CheckCircle size={20} /> : step.number}
            </div>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="create-event-content container">
        <div className="create-event-form">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="form-step animate-fade-in">
              <h2 className="step-heading">
                <FileText size={24} />
                Basic Information
              </h2>

              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2026"
                  className={`form-input ${formErrors.title ? 'error' : ''}`}
                />
                {formErrors.title && <p className="form-error">{formErrors.title}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief tagline for your event"
                  maxLength={100}
                  className={`form-input ${formErrors.shortDescription ? 'error' : ''}`}
                />
                <p className="form-helper">{formData.shortDescription.length}/100 characters</p>
                {formErrors.shortDescription && <p className="form-error">{formErrors.shortDescription}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of your event..."
                  rows={5}
                  className={`form-textarea ${formErrors.description ? 'error' : ''}`}
                />
                {formErrors.description && <p className="form-error">{formErrors.description}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`form-select ${formErrors.category ? 'error' : ''}`}
                  >
                    <option value="">Select category</option>
                    {eventCategories.filter(c => c !== 'All Events').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="form-error">{formErrors.category}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Event Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Venue */}
          {currentStep === 2 && (
            <div className="form-step animate-fade-in">
              <h2 className="step-heading">
                <Calendar size={24} />
                Date & Venue
              </h2>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`form-input ${formErrors.date ? 'error' : ''}`}
                  />
                  {formErrors.date && <p className="form-error">{formErrors.date}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`form-input ${formErrors.endDate ? 'error' : ''}`}
                  />
                  {formErrors.endDate && <p className="form-error">{formErrors.endDate}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue Name *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Convention Center"
                  className={`form-input ${formErrors.venue ? 'error' : ''}`}
                />
                {formErrors.venue && <p className="form-error">{formErrors.venue}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`form-select ${formErrors.city ? 'error' : ''}`}
                  >
                    <option value="">Select city</option>
                    {cities.filter(c => c !== 'All Cities').map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {formErrors.city && <p className="form-error">{formErrors.city}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="form-step animate-fade-in">
              <h2 className="step-heading">
                <DollarSign size={24} />
                Pricing & Capacity
              </h2>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ticket Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className={`form-input ${formErrors.price ? 'error' : ''}`}
                  />
                  <p className="form-helper">Set to 0 for free events</p>
                  {formErrors.price && <p className="form-error">{formErrors.price}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className={`form-input ${formErrors.capacity ? 'error' : ''}`}
                  />
                  {formErrors.capacity && <p className="form-error">{formErrors.capacity}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="technology, conference, networking (comma separated)"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Highlights</label>
                <div className="highlights-inputs">
                  {formData.highlights.map((highlight, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`highlight-${index}`}
                      value={highlight}
                      onChange={handleChange}
                      placeholder={`Highlight ${index + 1}`}
                      className="form-input"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="form-step animate-fade-in">
              <h2 className="step-heading">
                <CheckCircle size={24} />
                Review & Submit
              </h2>

              <div className="review-preview">
                <div className="review-image">
                  <img src={formData.image} alt={formData.title} />
                </div>

                <div className="review-content">
                  <h3>{formData.title || 'Event Title'}</h3>
                  <p className="review-short-desc">{formData.shortDescription}</p>

                  <div className="review-meta">
                    <div className="review-meta-item">
                      <Tag size={16} />
                      <span>{formData.category || 'Category'}</span>
                    </div>
                    <div className="review-meta-item">
                      <Calendar size={16} />
                      <span>{formData.date || 'Date'}</span>
                    </div>
                    <div className="review-meta-item">
                      <MapPin size={16} />
                      <span>{formData.venue}, {formData.city}</span>
                    </div>
                    <div className="review-meta-item">
                      <DollarSign size={16} />
                      <span>{formData.price > 0 ? `₹${formData.price}` : 'Free'}</span>
                    </div>
                    <div className="review-meta-item">
                      <Users size={16} />
                      <span>{formData.capacity} capacity</span>
                    </div>
                  </div>

                  {formData.highlights.some(h => h.trim()) && (
                    <div className="review-highlights">
                      <h4>Highlights</h4>
                      <ul>
                        {formData.highlights.filter(h => h.trim()).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Event'}
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
