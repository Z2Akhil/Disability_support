import React from 'react';

const TherapistCard = ({ 
  name, 
  photo, 
  specialty, 
  approach, 
  acceptsInsurance, 
  telemedicine, 
  rating, 
  onBook 
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 therapist-card h-100">
      <div className="card-body d-flex p-4">
        {/* Avatar */}
        <div className="me-4 flex-shrink-0">
          <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-semibold fs-3 shadow-sm overflow-hidden" style={{ width: '5rem', height: '5rem' }}>
            {photo ? (
              <img src={photo} alt={name} className="img-fluid h-100 w-100 object-fit-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow-1">
          <h5 className="fw-bold text-dark mb-1">{name}</h5>
          <p className="text-primary fw-medium mb-1">{specialty}</p>
          <p className="text-muted small mb-2 text-truncate-2">{approach}</p>

          {/* Tags */}
          <div className="d-flex flex-wrap gap-2">
            {acceptsInsurance && (
              <span className="badge bg-success bg-opacity-10 text-success small">Accepts Insurance</span>
            )}
            {telemedicine && (
              <span className="badge bg-purple bg-opacity-10 text-purple small">Telemedicine</span>
            )}
            <span className="badge bg-warning bg-opacity-10 text-warning d-inline-flex align-items-center small">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="card-footer bg-light border-top-0 text-end">
        <button 
          className="btn btn-primary btn-sm px-4 py-2 fw-medium"
          onClick={onBook}
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;
