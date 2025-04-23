import { useEffect } from 'react';
import {
  ClipboardCheck,
  PersonCircle,
  Telephone,
  ExclamationTriangle,
  HeartPulse
} from 'react-bootstrap-icons';

import { GiPill } from 'react-icons/gi'; // ✅ Optional react-icon retained

const MedicalIDForm = ({ values, onChange, onSubmit }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // Smooth polish
  }, []);

  return (
    <form onSubmit={onSubmit} className="row g-4 bg-white p-4 rounded shadow-sm">
      {/* Medical Conditions */}
      <div className="col-md-6">
        <label className="form-label fw-semibold d-flex align-items-center gap-2 text-secondary">
          <HeartPulse size={18} className="text-danger" />
          Medical Conditions
        </label>
        <textarea
          name="conditions"
          value={values.conditions}
          onChange={onChange}
          rows="3"
          className="form-control"
          placeholder="e.g., Diabetes, Hypertension..."
        />
      </div>

      {/* Current Medications */}
      <div className="col-md-6">
        <label className="form-label fw-semibold d-flex align-items-center gap-2 text-secondary">
          <GiPill size={18} className="text-purple" />
          Current Medications
        </label>
        <textarea
          name="medications"
          value={values.medications}
          onChange={onChange}
          rows="3"
          className="form-control"
          placeholder="e.g., Metformin, Aspirin..."
        />
      </div>

      {/* Allergies */}
      <div className="col-md-6">
        <label className="form-label fw-semibold d-flex align-items-center gap-2 text-secondary">
          <ExclamationTriangle size={18} className="text-warning" />
          Allergies
        </label>
        <textarea
          name="allergies"
          value={values.allergies}
          onChange={onChange}
          rows="2"
          className="form-control"
          placeholder="e.g., Penicillin, Peanuts..."
        />
      </div>

      {/* Emergency Contact */}
      <div className="col-md-6">
        <label className="form-label fw-semibold d-flex align-items-center gap-2 text-secondary">
          <Telephone size={18} className="text-success" />
          Emergency Contact
        </label>
        <input
          type="text"
          name="emergencyContact"
          value={values.emergencyContact}
          onChange={onChange}
          className="form-control"
          placeholder="e.g., John Doe - 9876543210"
        />
      </div>

      {/* Submit */}
      <div className="col-12 text-end">
        <button
          type="submit"
          className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm"
        >
          <ClipboardCheck size={18} />
          Save Medical ID
        </button>
      </div>
    </form>
  );
};

export default MedicalIDForm;
