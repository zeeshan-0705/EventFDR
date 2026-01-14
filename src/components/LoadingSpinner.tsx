import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'md', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: styles.spinnerSm,
    md: styles.spinnerMd,
    lg: styles.spinnerLg
  };

  const spinner = (
    <div className={`${styles.spinner} ${sizeClasses[size]}`}>
      <div className={styles.spinnerRing} />
      <div className={styles.spinnerRing} />
      <div className={styles.spinnerRing} />
      <div className={styles.spinnerDot} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.spinnerFullscreen}>
        {spinner}
        <p className={styles.spinnerText}>Loading...</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
