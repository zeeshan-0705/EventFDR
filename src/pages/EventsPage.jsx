import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { eventCategories, cities, priceRanges } from '../data/mockEvents';
import { filterEvents, sortEvents, debounce } from '../utils/helpers';
import { 
  Search, Filter, X, ChevronDown, SortAsc, 
  Grid, List, Calendar, MapPin, Tag 
} from 'lucide-react';
import './EventsPage.css';

const EventsPage = () => {
  const { events, isLoading } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Events');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('date-asc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Apply filters
  const filteredEvents = useMemo(() => {
    const filters = {
      query: searchQuery,
      category: selectedCategory,
      city: selectedCity,
      priceRange: priceRanges[selectedPriceRange],
      dateFrom: dateFrom || null,
      dateTo: dateTo || null
    };
    
    const filtered = filterEvents(events, filters);
    return sortEvents(filtered, sortBy);
  }, [events, searchQuery, selectedCategory, selectedCity, selectedPriceRange, dateFrom, dateTo, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'All Events') params.set('category', selectedCategory);
    if (selectedCity !== 'All Cities') params.set('city', selectedCity);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedCity, setSearchParams]);

  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Events');
    setSelectedCity('All Cities');
    setSelectedPriceRange(0);
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedCategory !== 'All Events' || 
    selectedCity !== 'All Cities' || 
    selectedPriceRange !== 0 ||
    dateFrom ||
    dateTo;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="container">
          <div className="events-header-content">
            <div className="events-header-text">
              <h1 className="events-title">Discover Events</h1>
              <p className="events-subtitle">
                Find amazing events happening near you
              </p>
            </div>

            {/* Search Bar */}
            <div className="events-search-bar">
              <div className="events-search-wrapper">
                <Search size={20} className="events-search-icon" />
                <input
                  type="text"
                  placeholder="Search events..."
                  defaultValue={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="events-search-input"
                />
                {searchQuery && (
                  <button 
                    className="events-search-clear"
                    onClick={() => {
                      setSearchQuery('');
                      document.querySelector('.events-search-input').value = '';
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button 
                className={`btn btn-secondary events-filter-toggle ${isFiltersOpen ? 'active' : ''}`}
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter size={18} />
                <span>Filters</span>
                {hasActiveFilters && <span className="filter-badge" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="events-content container">
        {/* Filters Panel */}
        <div className={`events-filters ${isFiltersOpen ? 'open' : ''}`}>
          <div className="events-filters-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <Tag size={16} />
              Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              {eventCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <MapPin size={16} />
              City
            </label>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="form-select"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <Tag size={16} />
              Price Range
            </label>
            <select 
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
              className="form-select"
            >
              {priceRanges.map((range, index) => (
                <option key={range.label} value={index}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <Calendar size={16} />
              Date Range
            </label>
            <div className="filter-date-range">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="form-input"
                placeholder="From"
              />
              <span className="filter-date-separator">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="form-input"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="events-main">
          {/* Toolbar */}
          <div className="events-toolbar">
            <p className="events-count">
              Showing <strong>{filteredEvents.length}</strong> events
            </p>

            <div className="events-toolbar-right">
              <div className="events-sort">
                <SortAsc size={16} />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="events-sort-select"
                >
                  <option value="date-asc">Date: Nearest First</option>
                  <option value="date-desc">Date: Latest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <div className="events-view-toggle">
                <button 
                  className={`events-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`events-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="events-active-filters">
              {searchQuery && (
                <span className="filter-tag">
                  Search: {searchQuery}
                  <button onClick={() => {
                    setSearchQuery('');
                    document.querySelector('.events-search-input').value = '';
                  }}><X size={14} /></button>
                </span>
              )}
              {selectedCategory !== 'All Events' && (
                <span className="filter-tag">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Events')}><X size={14} /></button>
                </span>
              )}
              {selectedCity !== 'All Cities' && (
                <span className="filter-tag">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('All Cities')}><X size={14} /></button>
                </span>
              )}
              {selectedPriceRange !== 0 && (
                <span className="filter-tag">
                  {priceRanges[selectedPriceRange].label}
                  <button onClick={() => setSelectedPriceRange(0)}><X size={14} /></button>
                </span>
              )}
            </div>
          )}

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className={`events-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="events-empty">
              <div className="events-empty-icon">
                <Calendar size={48} />
              </div>
              <h3>No events found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
