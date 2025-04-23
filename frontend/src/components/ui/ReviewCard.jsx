import { useState } from 'react';
import { CheckCircleFill, FlagFill } from 'react-bootstrap-icons';

const ReviewCard = ({
  author,
  rating,
  date,
  comment,
  verified = false,
  service,
  onHelpfulClick,
  onReportClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi bi-star-fill ${
          i < rating ? 'text-warning' : 'text-secondary opacity-25'
        }`}
        style={{ fontSize: '1rem' }}
      />
    ));

  const handleHelpfulClick = () => {
    if (!helpfulClicked) {
      setHelpfulClicked(true);
      onHelpfulClick?.();
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 transition-all hover-shadow-sm">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-semibold text-dark">{author}</h5>
            {verified && (
              <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1">
                <CheckCircleFill size={14} />
                Verified
              </span>
            )}
          </div>
          {service && (
            <small className="text-muted d-block mt-1">
              Used service: <span className="text-primary fw-medium">{service}</span>
            </small>
          )}
        </div>

        <div className="d-flex align-items-center gap-1">{renderStars()}</div>
      </div>

      {/* Comment */}
      <div className="mt-3">
        <p className={`text-secondary small ${!isExpanded ? 'text-truncate' : ''}`} style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {comment}
        </p>
        {comment.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-link px-0 pt-2 text-decoration-none text-primary small"
          >
            {isExpanded ? 'Show less ▲' : 'Read more ▼'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center small text-muted">
        <span>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
        <div className="d-flex gap-3 align-items-center">
          <button
            onClick={handleHelpfulClick}
            disabled={helpfulClicked}
            className={`btn btn-sm border-0 p-0 bg-transparent text-decoration-none d-flex align-items-center gap-1 ${
              helpfulClicked ? 'text-success fw-medium' : 'text-muted'
            }`}
          >
            {helpfulClicked ? '✓ Helpful' : 'Helpful?'}
          </button>
          <button
            onClick={onReportClick}
            className="btn btn-sm border-0 p-0 bg-transparent text-muted d-flex align-items-center gap-1 hover-text-danger"
          >
            <FlagFill size={14} />
            Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
