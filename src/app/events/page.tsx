'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEvents } from '@/contexts/EventContext';
import EventCard from '@/components/EventCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { filterEvents, sortEvents, debounce } from '@/utils/helpers';
import { eventCategories, cities, priceRanges } from '@/data/mockEvents';
import { EventFilters, PriceRange } from '@/types';
import { 
  Search, SlidersHorizontal, X, Grid3X3, List,
  ChevronDown, Calendar 
} from 'lucide-react';
import styles from './page.module.css';

function EventsPageContent() {
  const searchParams = useSearchParams();
  const { events, isLoading } = useEvents();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Events');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(priceRanges[0]);
  const [sortBy, setSortBy] = useState('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const filters: EventFilters = {
      query: debouncedQuery,
      category: selectedCategory,
      city: selectedCity,
      priceRange: selectedPriceRange
    };
    
    const filtered = filterEvents(events, filters);
    return sortEvents(filtered, sortBy);
  }, [events, debouncedQuery, selectedCategory, selectedCity, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Events');
    setSelectedCity('All Cities');
    setSelectedPriceRange(priceRanges[0]);
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedCategory !== 'All Events' || 
    selectedCity !== 'All Cities' ||
    selectedPriceRange !== priceRanges[0];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.eventsPage}>
      {/* Header */}
      <div className={styles.eventsHeader}>
        <div className="container">
          <h1 className={styles.eventsTitle}>
            <Calendar size={28} />
            Explore Events
          </h1>
          <p className={styles.eventsSubtitle}>
            {filteredEvents.length} events found
          </p>
        </div>
      </div>

      <div className={`${styles.eventsContent} container`}>
        {/* Search and Filters Bar */}
        <div className={styles.eventsToolbar}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className={styles.searchClear}
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className={styles.toolbarActions}>
            <button 
              className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {hasActiveFilters && <span className={styles.filterBadge} />}
            </button>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="date-asc">Date (Earliest)</option>
              <option value="date-desc">Date (Latest)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="popularity">Most Popular</option>
            </select>

            <div className={styles.viewToggle}>
              <button 
                className={viewMode === 'grid' ? styles.active : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button 
                className={viewMode === 'list' ? styles.active : ''}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <label>Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {eventCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>City</label>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Price Range</label>
              <select 
                value={selectedPriceRange.label}
                onChange={(e) => {
                  const range = priceRanges.find(r => r.label === e.target.value);
                  if (range) setSelectedPriceRange(range);
                }}
              >
                {priceRanges.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button 
                className={styles.clearFilters}
                onClick={clearFilters}
              >
                <X size={16} />
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Events Grid/List */}
        {filteredEvents.length > 0 ? (
          <div className={`${styles.eventsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <Search size={48} />
            <h3>No events found</h3>
            <p>Try adjusting your filters or search query</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <EventsPageContent />
    </Suspense>
  );
}
