// In components/ui/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
      sm: 'spinner-border-sm',
      md: '',
      lg: 'spinner-border-lg'
    };
  
    return (
      <div className={`spinner-border text-primary ${sizes[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  };
  
  export default LoadingSpinner;