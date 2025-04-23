import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light px-3">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
        <h2 className="h3 fw-semibold mb-3">Page Not Found</h2>
        <p className="fs-5 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
