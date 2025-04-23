const CaregiverProfileCard = ({
  name,
  photo,
  location,
  services = [],
  experience,
  languages = [],
  rating,
  rate,
  onBook,
  onViewProfile
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden hover-shadow">
      {/* Top */}
      <div className="card-body d-flex gap-3">
        {/* Profile photo */}
        <div className="flex-shrink-0">
          <div className="rounded-circle overflow-hidden border bg-light" style={{ width: 64, height: 64 }}>
            {photo ? (
              <img src={photo} alt={name} className="img-fluid h-100 w-100 object-fit-cover" />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 w-100 bg-primary bg-opacity-10 text-primary fs-4 fw-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow-1">
          <h5 className="card-title mb-1">{name}</h5>
          <p className="text-muted small mb-2">{location}</p>

          {/* Services */}
          <p className="fw-semibold small mb-1">Services Offered:</p>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {services.map((service, i) => (
              <span key={i} className="badge bg-primary bg-opacity-10 text-primary fw-medium text-capitalize">
                {service}
              </span>
            ))}
          </div>

          {/* Experience & Languages */}
          <div className="d-flex flex-wrap gap-4 small text-secondary">
            <div>
              <div className="fw-semibold mb-1">🧰 Experience</div>
              <div>{experience}</div>
            </div>
            <div>
              <div className="fw-semibold mb-1">🗣️ Languages</div>
              <div>{languages.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer d-flex justify-content-between align-items-center bg-light-subtle">
        <div className="d-flex align-items-center gap-2 small text-secondary">
          <span className="text-warning">★</span>
          <span className="fw-semibold">{rating}</span>
          <span className="text-muted">•</span>
          <span className="fw-medium">{rate}</span>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onViewProfile}
          >
            View Profile
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={onBook}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaregiverProfileCard;
