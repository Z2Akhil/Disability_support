import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const FloatingActionButton = forwardRef(({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  pulse = false,
  className = '',
  ...props
}, ref) => {
  const positions = {
    'bottom-right': 'position-fixed bottom-3 end-3',
    'bottom-left': 'position-fixed bottom-3 start-3',
    'top-right': 'position-fixed top-3 end-3',
    'top-left': 'position-fixed top-3 start-3',
    'center-right': 'position-fixed top-50 end-3 translate-middle-y',
    'center-left': 'position-fixed top-50 start-3 translate-middle-y'
  };

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning'
  };

  const sizes = {
    small: 'btn-sm rounded-circle d-flex justify-content-center align-items-center',
    medium: 'rounded-circle d-flex justify-content-center align-items-center',
    large: 'btn-lg rounded-circle d-flex justify-content-center align-items-center fs-5'
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        btn 
        shadow 
        ${positions[position]} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${pulse && !disabled ? 'animate__animated animate__pulse animate__infinite' : ''} 
        ${disabled ? 'disabled opacity-50' : ''}
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      <span className="d-flex align-items-center justify-content-center">
        {icon}
        {size === 'large' && (
          <span className="ms-2 fw-semibold d-none d-md-inline">
            {label}
          </span>
        )}
      </span>
    </button>
  );
});

FloatingActionButton.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left',
    'center-right',
    'center-left'
  ]),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  pulse: PropTypes.bool,
  className: PropTypes.string
};

export default FloatingActionButton;
