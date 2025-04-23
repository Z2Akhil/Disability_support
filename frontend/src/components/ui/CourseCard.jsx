const CourseCard = ({
  title,
  category,
  duration,
  supportLevel,
  description,
  price,
  actionText,
  onAction
}) => {
  const supportLevelBadges = {
    'screen-reader': 'bg-opacity-10 bg-primary text-primary',
    'sign-language': 'bg-opacity-10 bg-info text-info',
    'captioning': 'bg-opacity-10 bg-success text-success',
    'adaptive': 'bg-opacity-10 bg-warning text-warning'
  };

  const badgeClass = supportLevelBadges[supportLevel?.toLowerCase()] || 'bg-light text-secondary';

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
      <div className="card-body d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-1">{title}</h5>
            <p className="text-muted small">{category}</p>
          </div>
          <span className={`badge rounded-pill fw-medium text-capitalize ${badgeClass}`}>
            {supportLevel}
          </span>
        </div>

        {/* Description */}
        <p className="card-text text-secondary small mb-4" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto d-flex justify-content-between align-items-end">
          <div>
            <p className="mb-1 small text-muted">
              ⏱ <span className="fw-medium">Duration:</span> {duration}
            </p>
            <h6 className="fw-bold mb-0 text-dark">
              {price === 'Free' ? 'Free' : `$${price}`}
            </h6>
          </div>
          <button
            className="btn btn-sm btn-primary"
            onClick={onAction}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
