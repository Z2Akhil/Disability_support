import { useState } from 'react';
import SOSButton from '../components/ui/SOSButton';
import EmergencyContactCard from '../components/ui/EmergencyContactCard';
import MedicalIDForm from '../components/ui/MedicalIDForm';

const EmergencyServices = () => {
  const [medicalID, setMedicalID] = useState({
    conditions: '',
    medications: '',
    allergies: '',
    emergencyContact: ''
  });

  const emergencyContacts = [
    { id: 1, name: "Police", number: "911", icon: "👮" },
    { id: 2, name: "Ambulance", number: "911", icon: "🚑" },
    { id: 3, name: "Disability Crisis Line", number: "1-800-555-0199", icon: "🦽" },
    { id: 4, name: "Poison Control", number: "1-800-222-1222", icon: "⚠️" }
  ];

  const emergencyGuides = [
    {
      id: 1,
      title: "Seizure First Aid",
      steps: [
        "Stay calm and time the seizure",
        "Clear area of hard or sharp objects",
        "Cushion the head",
        "Do not restrain or put anything in mouth",
        "Turn person on side after movements stop",
        "Call ambulance if seizure lasts more than 5 minutes"
      ]
    },
    {
      id: 2,
      title: "Fall Response",
      steps: [
        "Assess for injuries before moving",
        "Help person to comfortable position",
        "Check for pain or discomfort",
        "Apply ice to bruises or swelling",
        "Monitor for confusion or dizziness",
        "Seek medical help if needed"
      ]
    }
  ];

  const handleSOS = () => {
    console.log("SOS activated - contacting emergency services");
  };

  const handleMedicalIDChange = (e) => {
    const { name, value } = e.target;
    setMedicalID(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicalIDSubmit = (e) => {
    e.preventDefault();
    console.log("Medical ID saved:", medicalID);
  };

  return (
    <div className="container py-5">
      {/* SOS Section */}
      <div className="text-center mb-5">
        <SOSButton onClick={handleSOS} />
        <small className="d-block mt-2 text-muted">Press in case of emergency</small>
      </div>

      <h1 className="display-5 fw-bold mb-4 text-center">Emergency Services</h1>

      {/* Emergency Contacts */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Emergency Contacts</h2>
        <div className="row g-4">
          {emergencyContacts.map(contact => (
            <div key={contact.id} className="col-12 col-sm-6 col-lg-3">
              <EmergencyContactCard
                name={contact.name}
                number={contact.number}
                icon={contact.icon}
                onCall={() => console.log(`Calling ${contact.name}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Guides */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-4">Emergency Guides</h2>
        <div className="row g-4">
          {emergencyGuides.map(guide => (
            <div key={guide.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">{guide.title}</h5>
                  <ol className="ps-3 mb-3">
                    {guide.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                  <button className="btn btn-outline-primary">Download Guide</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Medical ID */}
      <section className="bg-light p-4 rounded mb-5 border">
        <h2 className="h4 fw-bold mb-3">Medical ID</h2>
        <p className="text-muted mb-4">Store critical medical information accessible to emergency responders.</p>
        
        <MedicalIDForm
          values={medicalID}
          onChange={handleMedicalIDChange}
          onSubmit={handleMedicalIDSubmit}
        />

        <div className="mt-4 p-3 bg-white border rounded">
          <h5 className="fw-semibold mb-2">Offline Access</h5>
          <p className="mb-3">Download your medical ID to your device for offline access:</p>
          <button className="btn btn-success">Download Medical ID Card</button>
        </div>
      </section>

      {/* Emergency Plan */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Emergency Preparedness</h2>
        <div className="card shadow-sm p-4">
          <h5 className="fw-semibold mb-2">Create an Emergency Plan</h5>
          <p className="mb-3">Prepare for emergencies by creating a personalized plan tailored to your needs.</p>
          <button className="btn btn-primary">Start Emergency Plan</button>
        </div>
      </section>
    </div>
  );
};

export default EmergencyServices;
