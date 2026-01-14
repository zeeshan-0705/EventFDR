import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  };

  const spinner = (
    <div className={`spinner ${sizeClasses[size]}`}>
      <div className="spinner-ring" />
      <div className="spinner-ring" />
      <div className="spinner-ring" />
      <div className="spinner-dot" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
