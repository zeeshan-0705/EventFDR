'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { isValidEmail } from '@/utils/helpers';
import { Eye, EyeOff, Mail, Lock, Calendar, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  const { success } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const from = searchParams.get('from') || '/';

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    const result = await login(email, password);
    
    if (result.success) {
      success('Welcome back!');
      router.push(from);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackground}>
        <div className={styles.authGradient1} />
        <div className={styles.authGradient2} />
      </div>

      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Link href="/" className={styles.authLogo}>
              <Calendar size={32} />
              <span>Event<span className={styles.accent}>FDR</span></span>
            </Link>
            <h1 className={styles.authTitle}>Welcome Back</h1>
            <p className={styles.authSubtitle}>
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && (
              <div className={styles.authError}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email Address</label>
              <div className={styles.inputWithIcon}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${styles.formInput} ${formErrors.email ? styles.error : ''}`}
                />
              </div>
              {formErrors.email && (
                <p className={styles.formError}>{formErrors.email}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.formLabelRow}>
                <label className={styles.formLabel}>Password</label>
                <Link href="/forgot-password" className={styles.formLink}>
                  Forgot Password?
                </Link>
              </div>
              <div className={styles.inputWithIcon}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className={styles.authDivider}>
            <span>or</span>
          </div>

          <div className={styles.authDemo}>
            <p>Try with demo account:</p>
            <button
              className="btn btn-secondary w-full"
              onClick={() => {
                setEmail('demo@eventfdr.com');
                setPassword('demo123');
              }}
            >
              Use Demo Account
            </button>
          </div>

          <div className={styles.authFooter}>
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register" className={styles.authLink}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.authPage} />}>
      <LoginPageContent />
    </Suspense>
  );
}
