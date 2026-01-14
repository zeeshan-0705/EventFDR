'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/utils/helpers';
import { 
  Home, Search, Calendar, User, LogOut, Menu, X, 
  Ticket, Plus, Settings, ChevronDown 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';

interface NavLink {
  path: string;
  label: string;
  icon: typeof Home;
  requiresAuth?: boolean;
}

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks: NavLink[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Search },
    { path: '/my-tickets', label: 'My Tickets', icon: Ticket, requiresAuth: true },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const filteredNavLinks = navLinks.filter(link => 
    !link.requiresAuth || isAuthenticated
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link href="/" className={styles.navbarLogo}>
          <div className={styles.navbarLogoIcon}>
            <Calendar size={24} />
          </div>
          <span className={styles.navbarLogoText}>
            Event<span className={styles.accent}>FDR</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navbarNav}>
          {filteredNavLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navbarLink} ${pathname === link.path ? styles.active : ''}`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className={styles.navbarActions}>
          {isAuthenticated ? (
            <>
              <Link href="/create-event" className={`btn btn-primary btn-sm ${styles.navbarCreateBtn}`}>
                <Plus size={16} />
                <span>Create Event</span>
              </Link>

              <div className={styles.navbarUserMenu} ref={userMenuRef}>
                <button 
                  className={styles.navbarUserTrigger}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className={styles.navbarAvatar}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{getInitials(user?.name)}</span>
                    )}
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`${styles.navbarUserChevron} ${isUserMenuOpen ? styles.open : ''}`} 
                  />
                </button>

                {isUserMenuOpen && (
                  <div className={styles.navbarDropdown}>
                    <div className={styles.navbarDropdownHeader}>
                      <p className={styles.navbarDropdownName}>{user?.name}</p>
                      <p className={styles.navbarDropdownEmail}>{user?.email}</p>
                    </div>
                    <div className={styles.navbarDropdownDivider} />
                    <Link 
                      href="/profile" 
                      className={styles.navbarDropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      href="/my-tickets" 
                      className={styles.navbarDropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Ticket size={16} />
                      <span>My Tickets</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      className={styles.navbarDropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <div className={styles.navbarDropdownDivider} />
                    <button 
                      className={`${styles.navbarDropdownItem} ${styles.navbarDropdownLogout}`}
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
            <div className={styles.navbarAuthButtons}>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className={styles.navbarMobileToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.navbarMobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.navbarMobileLinks}>
          {filteredNavLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navbarMobileLink} ${pathname === link.path ? styles.active : ''}`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link href="/create-event" className={styles.navbarMobileLink}>
                <Plus size={20} />
                <span>Create Event</span>
              </Link>
              <Link href="/profile" className={styles.navbarMobileLink}>
                <User size={20} />
                <span>My Profile</span>
              </Link>
              <button 
                className={`${styles.navbarMobileLink} ${styles.navbarMobileLogout}`}
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className={styles.navbarMobileAuth}>
              <Link href="/login" className="btn btn-secondary w-full">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary w-full">
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
