import { useEffect, useRef } from 'react';
import useLocation from '../../hooks/useLocation';
import { BsGeoAlt } from 'react-icons/bs';
; // Optional: use Bootstrap icon

const MapComponent = ({ locations = [], onLocationSelect }) => {
  const mapRef = useRef(null);
  const { location: userLocation, isLoading, error } = useLocation();

  useEffect(() => {
    if (!window.mapInitialized && mapRef.current) {
      console.log('Initializing map...');
      window.mapInitialized = true;

      mapRef.current.innerHTML = `
        <div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:500;color:#666;">
          Interactive Map Placeholder 🗺️
        </div>
      `;
    }
  }, []);
  
  useEffect(() => {
    if (userLocation) {
      console.log('User location updated:', userLocation);
    }
  }, [userLocation]);

  return (
    <div
      ref={mapRef}
      className="position-relative w-100 h-100 border border-light rounded shadow-sm overflow-hidden"
      aria-label="Interactive map"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
          <div className="d-flex align-items-center text-white gap-2">
            <div className="spinner-border spinner-border-sm text-light me-2" role="status"></div>
            <span className="fw-medium">Fetching location...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-danger bg-opacity-10 text-danger d-flex justify-content-center align-items-center p-3 text-center z-3">
          <p className="fw-semibold">{error}</p>
        </div>
      )}

      {/* Placeholder Map UI */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex flex-column justify-content-center align-items-center text-secondary z-0">
        <BsGeoAlt  size={40} className="text-primary mb-2" />
        <p className="fw-semibold">Map View Placeholder</p>

        {userLocation && (
          <div className="mt-2 bg-white text-primary small fw-medium px-3 py-1 rounded-pill shadow-sm">
            📍 Your Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
