import { useState } from 'react';
import CaregiverProfileCard from '../components/ui/CaregiverProfileCard';
import FloatingActionButton from '../components/ui/FloatingActionButton';

const CaregiverSupport = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    serviceType: '',
    availability: 'all'
  });

  const caregivers = [/* your caregivers data here */];
  const resources = [/* your resources data here */];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCaregivers = caregivers.filter(caregiver => {
    return (
      (searchFilters.location === '' || 
        caregiver.location.toLowerCase().includes(searchFilters.location.toLowerCase())) &&
      (searchFilters.serviceType === '' || 
        caregiver.services.some(service => 
          service.toLowerCase().includes(searchFilters.serviceType.toLowerCase()))) &&
      (searchFilters.availability === 'all' || 
        caregiver.availability.includes(searchFilters.availability))
    );
  });

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-4 text-center">Caregiver Support</h1>

      {/* Search Filters */}
      <section className="mb-5">
        <h2 className="h4 mb-3">Find Professional Caregivers</h2>
        <div className="card p-4 shadow-sm mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                placeholder="City or ZIP"
                className="form-control"
                value={searchFilters.location}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Service Type</label>
              <input
                type="text"
                name="serviceType"
                placeholder="e.g. Personal Care"
                className="form-control"
                value={searchFilters.serviceType}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Availability</label>
              <select
                name="availability"
                className="form-select"
                value={searchFilters.availability}
                onChange={handleFilterChange}
              >
                <option value="all">Any Time</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary w-100">Search Caregivers</button>
          </div>
        </div>

        {/* Caregiver Cards */}
        <div className="row g-4">
          {filteredCaregivers.map(caregiver => (
            <div className="col-md-6 col-lg-4" key={caregiver.id}>
              <CaregiverProfileCard
                {...caregiver}
                onBook={() => console.log(`Booking ${caregiver.name}`)}
                onViewProfile={() => console.log(`Viewing ${caregiver.name}'s profile`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="mb-5">
        <h2 className="h4 mb-4">Caregiver Resources</h2>
        <div className="row g-4">
          {resources.map(resource => (
            <div className="col-md-6 col-lg-4" key={resource.id}>
              <div className="card h-100 shadow-sm p-3">
                <div className="d-flex align-items-start">
                  <div className="fs-2 me-3">
                    {resource.type === 'video' ? '🎬' : resource.type === 'guide' ? '📖' : '📄'}
                  </div>
                  <div>
                    <h5 className="card-title mb-1">{resource.title}</h5>
                    <p className="text-muted small">{resource.type} • {resource.length}</p>
                    <button className="btn btn-link p-0 text-primary">
                      {resource.type === 'video' ? 'Watch' : 'View'} Resource
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Forum */}
      <section className="mb-5">
        <h2 className="h4 mb-3">Caregiver Community Forum</h2>
        <div className="card p-4 shadow-sm">
          <p className="mb-4">Connect with other caregivers to share experiences, ask questions, and find support.</p>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn btn-primary">Browse Discussions</button>
            <button className="btn btn-success">Start New Topic</button>
          </div>
        </div>
      </section>

      <FloatingActionButton 
        icon="💬" 
        onClick={() => console.log("Opening quick chat")}
        label="Quick Help"
      />
    </div>
  );
};

export default CaregiverSupport;
