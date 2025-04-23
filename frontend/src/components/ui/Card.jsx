import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Card = forwardRef(({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  actionText,
  onAction,
  variant = 'default',
  tags = [],
  icon,
  children,
  className = '',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white border',
    elevated: 'bg-white shadow-sm border',
    primary: 'bg-primary bg-opacity-10 border border-primary',
    dark: 'bg-dark text-light border border-secondary'
  };

  const renderImage = () =>
    image && (
      <img 
        src={image}
        alt={imageAlt || 'Card image'}
        className="card-img-top object-fit-cover"
        style={{ height: '240px', objectFit: 'cover' }}
        loading="lazy"
      />
    );

  const renderIcon = () =>
    icon && (
      <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-25 text-primary fs-3 mb-3 mx-auto" style={{ width: '3rem', height: '3rem' }}>
        {icon}
      </div>
    );

  return (
    <div
      ref={ref}
      className={`card rounded-4 overflow-hidden ${variants[variant]} ${className}`}
      {...props}
    >
      {renderImage()}

      <div className="card-body">
        {renderIcon()}

        {title && (
          <h5 className={`card-title fw-bold ${variant === 'dark' ? 'text-white' : ''}`}>
            {title}
          </h5>
        )}

        {subtitle && (
          <h6 className={`card-subtitle mb-2 ${variant === 'dark' ? 'text-light' : 'text-muted'}`}>
            {subtitle}
          </h6>
        )}

        {description && (
          <p className={`card-text ${variant === 'dark' ? 'text-light' : 'text-secondary'}`}>
            {description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className={`badge rounded-pill ${
                  variant === 'dark' 
                    ? 'bg-primary text-light' 
                    : 'bg-primary bg-opacity-10 text-primary'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {children}

        {actionText && (
          <button
            onClick={onAction}
            className={`btn w-100 mt-3 ${
              variant === 'dark' ? 'btn-primary' : 'btn-outline-primary'
            }`}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
});

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'elevated', 'primary', 'dark']),
  tags: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string
};

export default Card;
