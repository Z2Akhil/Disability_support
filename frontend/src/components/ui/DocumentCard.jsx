import { useState } from 'react';
import { Link } from 'react-router-dom';

const DocumentCard = ({
  title,
  description,
  type,
  format,
  size,
  language,
  downloadUrl,
  previewUrl,
  accessibilityFeatures = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeIcons = {
    guide: '📖',
    form: '📝',
    legal: '⚖️',
    resource: '📚',
    medical: '🏥',
    government: '🏛️',
    default: '📄'
  };

  const formatIcons = {
    pdf: '📄',
    word: '📝',
    audio: '🎧',
    video: '🎬',
    text: '✏️',
    braille: '👆',
    default: '📁'
  };

  const accessibilityBadges = {
    'screen-reader': { label: 'Screen Reader', icon: '👁️' },
    'large-print': { label: 'Large Print', icon: '🔍' },
    'alt-text': { label: 'Alt Text', icon: '📝' },
    'captions': { label: 'Captions', icon: '🎞️' },
    'sign-language': { label: 'Sign Language', icon: '👐' }
  };

  return (
    <div className={`card shadow-sm border-0 rounded-4 mb-4 overflow-hidden ${isExpanded ? 'border-primary' : ''}`}>
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="d-flex gap-3">
            <div className="fs-3">{typeIcons[type] || typeIcons.default}</div>
            <div>
              <h5 className="card-title mb-1">{title}</h5>
              <div className="d-flex flex-wrap gap-2 mt-1">
                <span className="badge bg-primary-subtle text-primary-emphasis text-uppercase d-flex align-items-center gap-1">
                  {formatIcons[format] || formatIcons.default} {format}
                </span>
                <span className="badge bg-light text-dark">{size}</span>
                <span className="badge bg-success-subtle text-success-emphasis">{language}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-light"
            aria-label="Toggle details"
          >
            <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} text-body`}></i>
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 border-top pt-4 small text-secondary">
            {description && <p className="mb-3">{description}</p>}

            {accessibilityFeatures.length > 0 && (
              <div className="mb-3">
                <h6 className="text-dark mb-2">Accessibility Features:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {accessibilityFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="badge bg-purple-subtle text-purple-emphasis d-inline-flex align-items-center gap-1"
                    >
                      {accessibilityBadges[feature]?.icon || '♿'} {accessibilityBadges[feature]?.label || feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap gap-2">
              <a
                href={downloadUrl}
                download
                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
              >
                <i className="bi bi-download"></i> Download
              </a>

              {previewUrl && (
                <Link
                  to={previewUrl}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                >
                  <i className="bi bi-eye"></i> Preview
                </Link>
              )}

              <button className="btn btn-sm btn-light d-flex align-items-center gap-1 text-muted">
              <i className="bi bi-share"></i> <strong>Share</strong>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
