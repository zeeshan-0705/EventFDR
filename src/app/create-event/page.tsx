'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { eventCategories, cities } from '@/data/mockEvents';
import { 
  Calendar, MapPin, DollarSign, Users, 
  Tag, FileText, Plus, ArrowLeft, CheckCircle 
} from 'lucide-react';
import styles from './page.module.css';

export default function CreateEventPage() {
  const router = useRouter();
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
    highlights: ['', '', '', '', '']
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
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

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
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
      if (Number(formData.price) < 0) errors.price = 'Price cannot be negative';
      if (Number(formData.capacity) < 1) errors.capacity = 'Capacity must be at least 1';
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
      organizer: {
        name: user?.name || '',
        email: user?.email || '',
        verified: false
      },
      schedule: [
        { day: 'Day 1', title: 'Main Event', time: `${formData.time} - ${formData.endTime}` }
      ]
    };
    
    const result = await addEvent(eventData);
    
    if (result.success && result.event) {
      success('Event created successfully!');
      router.push(`/event/${result.event.id}`);
    } else {
      error(result.error || 'Failed to create event');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.createEventAuthRequired}>
        <div className={styles.authRequiredContent}>
          <Calendar size={64} />
          <h2>Sign in to create events</h2>
          <p>Please log in to create and manage your events</p>
          <Link href="/login" className="btn btn-primary">
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
    <div className={styles.createEventPage}>
      <div className={styles.createEventHeader}>
        <div className="container">
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1>Create New Event</h1>
          <p>Fill in the details to create your event</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={`${styles.progressSteps} container`}>
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`${styles.progressStep} ${currentStep >= step.number ? styles.active : ''} ${currentStep > step.number ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>
              {currentStep > step.number ? <CheckCircle size={20} /> : step.number}
            </div>
            <span className={styles.stepTitle}>{step.title}</span>
          </div>
        ))}
      </div>

      <div className={`${styles.createEventContent} container`}>
        <div className={styles.createEventForm}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepHeading}>
                <FileText size={24} />
                Basic Information
              </h2>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2026"
                  className={`${styles.formInput} ${formErrors.title ? styles.error : ''}`}
                />
                {formErrors.title && <p className={styles.formError}>{formErrors.title}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Short Description *</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief tagline for your event"
                  maxLength={100}
                  className={`${styles.formInput} ${formErrors.shortDescription ? styles.error : ''}`}
                />
                <p className={styles.formHelper}>{formData.shortDescription.length}/100 characters</p>
                {formErrors.shortDescription && <p className={styles.formError}>{formErrors.shortDescription}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of your event..."
                  rows={5}
                  className={`${styles.formTextarea} ${formErrors.description ? styles.error : ''}`}
                />
                {formErrors.description && <p className={styles.formError}>{formErrors.description}</p>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${styles.formSelect} ${formErrors.category ? styles.error : ''}`}
                  >
                    <option value="">Select category</option>
                    {eventCategories.filter(c => c !== 'All Events').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className={styles.formError}>{formErrors.category}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Event Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Venue */}
          {currentStep === 2 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepHeading}>
                <Calendar size={24} />
                Date & Venue
              </h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`${styles.formInput} ${formErrors.date ? styles.error : ''}`}
                  />
                  {formErrors.date && <p className={styles.formError}>{formErrors.date}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`${styles.formInput} ${formErrors.endDate ? styles.error : ''}`}
                  />
                  {formErrors.endDate && <p className={styles.formError}>{formErrors.endDate}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Venue Name *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Convention Center"
                  className={`${styles.formInput} ${formErrors.venue ? styles.error : ''}`}
                />
                {formErrors.venue && <p className={styles.formError}>{formErrors.venue}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`${styles.formSelect} ${formErrors.city ? styles.error : ''}`}
                  >
                    <option value="">Select city</option>
                    {cities.filter(c => c !== 'All Cities').map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {formErrors.city && <p className={styles.formError}>{formErrors.city}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepHeading}>
                <DollarSign size={24} />
                Pricing & Capacity
              </h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ticket Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className={`${styles.formInput} ${formErrors.price ? styles.error : ''}`}
                  />
                  <p className={styles.formHelper}>Set to 0 for free events</p>
                  {formErrors.price && <p className={styles.formError}>{formErrors.price}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className={`${styles.formInput} ${formErrors.capacity ? styles.error : ''}`}
                  />
                  {formErrors.capacity && <p className={styles.formError}>{formErrors.capacity}</p>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="technology, conference, networking (comma separated)"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Event Highlights</label>
                <div className={styles.highlightsInputs}>
                  {formData.highlights.map((highlight, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`highlight-${index}`}
                      value={highlight}
                      onChange={handleChange}
                      placeholder={`Highlight ${index + 1}`}
                      className={styles.formInput}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className={styles.formStep}>
              <h2 className={styles.stepHeading}>
                <CheckCircle size={24} />
                Review & Submit
              </h2>

              <div className={styles.reviewPreview}>
                <div className={styles.reviewImage}>
                  <img src={formData.image} alt={formData.title} />
                </div>

                <div className={styles.reviewContent}>
                  <h3>{formData.title || 'Event Title'}</h3>
                  <p className={styles.reviewShortDesc}>{formData.shortDescription}</p>

                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewMetaItem}>
                      <Tag size={16} />
                      <span>{formData.category || 'Category'}</span>
                    </div>
                    <div className={styles.reviewMetaItem}>
                      <Calendar size={16} />
                      <span>{formData.date || 'Date'}</span>
                    </div>
                    <div className={styles.reviewMetaItem}>
                      <MapPin size={16} />
                      <span>{formData.venue}, {formData.city}</span>
                    </div>
                    <div className={styles.reviewMetaItem}>
                      <DollarSign size={16} />
                      <span>{Number(formData.price) > 0 ? `₹${formData.price}` : 'Free'}</span>
                    </div>
                    <div className={styles.reviewMetaItem}>
                      <Users size={16} />
                      <span>{formData.capacity} capacity</span>
                    </div>
                  </div>

                  {formData.highlights.some(h => h.trim()) && (
                    <div className={styles.reviewHighlights}>
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
          <div className={styles.formActions}>
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
}
