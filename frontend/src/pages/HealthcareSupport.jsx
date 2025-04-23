import { useState } from 'react';
import FloatingActionButton from '../components/ui/FloatingActionButton'; // Assume this is already styled with Bootstrap
import Card from '../components/ui/Card'; // Should be Bootstrap-based
import MapComponent from '../components/ui/MapComponent'; // Map styling remains unchanged

const HealthcareSupport = () => {
  const [showTelemedicine, setShowTelemedicine] = useState(true);
  const [showInPerson, setShowInPerson] = useState(true);

  const specialists = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Physical Therapy",
      telemedicine: true,
      inPerson: true,
      location: "123 Main St, Cityville",
      rating: 4.8
    },
    // Add more specialists...
  ];

  const hospitals = [
    {
      id: 1,
      name: "City General Hospital",
      accessible: true,
      distance: "2.5 miles",
      coordinates: [40.7128, -74.0060]
    },
    // Add more hospitals...
  ];

  const filteredSpecialists = specialists.filter(s =>
    (showTelemedicine && s.telemedicine) || (showInPerson && s.inPerson)
  );

  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold mb-4 text-center">Healthcare Support</h1>

      {/* === Specialists Section === */}
      <section className="mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h2 className="h4 fw-bold">Find Specialists</h2>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showTelemedicine}
                onChange={() => setShowTelemedicine(!showTelemedicine)}
                id="telemedicineCheck"
              />
              <label className="form-check-label" htmlFor="telemedicineCheck">
                Telemedicine
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showInPerson}
                onChange={() => setShowInPerson(!showInPerson)}
                id="inPersonCheck"
              />
              <label className="form-check-label" htmlFor="inPersonCheck">
                In-Person
              </label>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {filteredSpecialists.map(s => (
            <div key={s.id} className="col-12 col-md-6 col-lg-4">
              <Card
                title={s.name}
                subtitle={s.specialty}
                description={`${s.telemedicine ? 'Telemedicine available. ' : ''}${s.inPerson ? 'In-person visits.' : ''}`}
                footer={`Rating: ${s.rating}/5`}
                actionText="Book Appointment"
                onAction={() => console.log(`Booking ${s.name}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* === Hospitals Map Section === */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Accessible Hospitals Near You</h2>
        <div className="rounded overflow-hidden mb-3" style={{ height: '400px' }}>
          <MapComponent locations={hospitals} />
        </div>
        <div className="row g-4">
          {hospitals.map(h => (
            <div key={h.id} className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{h.name}</h5>
                  <p className={`text-${h.accessible ? 'success' : 'warning'}`}>
                    {h.accessible ? 'Fully Accessible' : 'Partial Accessibility'}
                  </p>
                  <p className="text-muted">{h.distance} away</p>
                  <button className="btn btn-primary mt-2">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Health Resources Section === */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Health Resources</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Managing Chronic Conditions</h5>
                <p className="card-text">Learn strategies for managing chronic pain and conditions with our expert guides.</p>
                <button className="btn btn-primary">View Resources</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Mental Health & Disability</h5>
                <p className="card-text">Explore the connection between physical disability and mental health.</p>
                <button className="btn btn-primary">Read Articles</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Floating Button === */}
      <FloatingActionButton
        icon="📞"
        label="Emergency Contact"
        onClick={() => console.log("Emergency contact activated")}
      />
    </div>
  );
};

export default HealthcareSupport;
