'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { isValidEmail, isValidPhone } from '@/utils/helpers';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowRight } from 'lucide-react';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const { success } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      success('Account created successfully!');
      router.push('/');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackground}>
        <div className={styles.authGradient1} />
        <div className={styles.authGradient2} />
      </div>

      <div className={styles.authContainer} style={{ maxWidth: '520px' }}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Link href="/" className={styles.authLogo}>
              <Calendar size={32} />
              <span>Event<span className={styles.accent}>FDR</span></span>
            </Link>
            <h1 className={styles.authTitle}>Create Account</h1>
            <p className={styles.authSubtitle}>
              Join us and discover amazing events
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && (
              <div className={styles.authError}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name</label>
              <div className={styles.inputWithIcon}>
                <User size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`${styles.formInput} ${formErrors.name ? styles.error : ''}`}
                />
              </div>
              {formErrors.name && (
                <p className={styles.formError}>{formErrors.name}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email Address</label>
              <div className={styles.inputWithIcon}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`${styles.formInput} ${formErrors.email ? styles.error : ''}`}
                />
              </div>
              {formErrors.email && (
                <p className={styles.formError}>{formErrors.email}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone Number (Optional)</label>
              <div className={styles.inputWithIcon}>
                <Phone size={18} className={styles.inputIcon} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`${styles.formInput} ${formErrors.phone ? styles.error : ''}`}
                />
              </div>
              {formErrors.phone && (
                <p className={styles.formError}>{formErrors.phone}</p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password</label>
                <div className={styles.inputWithIcon}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    className={`${styles.formInput} ${formErrors.password ? styles.error : ''}`}
                  />
                  <button
                    type="button"
                    className={styles.inputToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className={styles.formError}>{formErrors.password}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirm Password</label>
                <div className={styles.inputWithIcon}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm"
                    className={`${styles.formInput} ${formErrors.confirmPassword ? styles.error : ''}`}
                  />
                  <button
                    type="button"
                    className={styles.inputToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className={styles.formError}>{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#71717a', textAlign: 'center', marginBottom: '1.5rem' }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: '#60a5fa' }}>Terms of Service</a> and{' '}
              <a href="#" style={{ color: '#60a5fa' }}>Privacy Policy</a>
            </p>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Already have an account?{' '}
              <Link href="/login" className={styles.authLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
