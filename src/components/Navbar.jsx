import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils/helpers';
import { 
  Home, Search, Calendar, User, LogOut, Menu, X, 
  Ticket, Plus, Settings, ChevronDown 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Search },
    { path: '/my-tickets', label: 'My Tickets', icon: Ticket, requiresAuth: true },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const filteredNavLinks = navLinks.filter(link => 
    !link.requiresAuth || isAuthenticated
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Calendar size={24} />
          </div>
          <span className="navbar-logo-text">
            Event<span className="accent">FDR</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {filteredNavLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/create-event" className="btn btn-primary btn-sm navbar-create-btn">
                <Plus size={16} />
                <span>Create Event</span>
              </Link>

              <div className="navbar-user-menu" ref={userMenuRef}>
                <button 
                  className="navbar-user-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="navbar-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{getInitials(user?.name)}</span>
                    )}
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`navbar-user-chevron ${isUserMenuOpen ? 'open' : ''}`} 
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{user?.name}</p>
                      <p className="navbar-dropdown-email">{user?.email}</p>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link 
                      to="/profile" 
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/my-tickets" 
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Ticket size={16} />
                      <span>My Tickets</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <div className="navbar-dropdown-divider" />
                    <button 
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-links">
          {filteredNavLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link to="/create-event" className="navbar-mobile-link">
                <Plus size={20} />
                <span>Create Event</span>
              </Link>
              <Link to="/profile" className="navbar-mobile-link">
                <User size={20} />
                <span>My Profile</span>
              </Link>
              <button 
                className="navbar-mobile-link navbar-mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="navbar-mobile-auth">
              <Link to="/login" className="btn btn-secondary w-full">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary w-full">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
