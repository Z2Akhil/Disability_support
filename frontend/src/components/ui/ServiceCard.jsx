// In components/ui/ServiceCard.jsx
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, description, icon, link, rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    
    return stars;
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body text-center">
        <div className="fs-1 mb-3">{icon}</div>
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text">{description}</p>
        {rating && (
          <div className="mb-2">
            {renderStars()}
            <span className="ms-1 small text-muted">({rating})</span>
          </div>
        )}
        {link && (
          <Link to={link} className="btn btn-outline-primary">
            Learn More
          </Link>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;