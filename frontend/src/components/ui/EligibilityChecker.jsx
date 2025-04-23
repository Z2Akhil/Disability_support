import React, { useState } from 'react';

const EligibilityChecker = () => {
  const [answers, setAnswers] = useState({
    age: '',
    disabilityType: '',
    income: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Checking eligibility with:', answers);
    // Insert eligibility logic here
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 mx-auto my-5" style={{ maxWidth: '720px' }}>
      <h2 className="card-title text-center mb-4">Eligibility Checker</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Age */}
          <div className="col-md-6">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              placeholder="e.g. 25"
              value={answers.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Disability Type */}
          <div className="col-md-6">
            <label htmlFor="disabilityType" className="form-label">Type of Disability</label>
            <select
              className="form-select"
              id="disabilityType"
              name="disabilityType"
              value={answers.disabilityType}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="physical">Physical</option>
              <option value="sensory">Sensory</option>
              <option value="cognitive">Cognitive</option>
              <option value="mental">Mental Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Income */}
          <div className="col-md-6">
            <label htmlFor="income" className="form-label">Annual Income</label>
            <select
              className="form-select"
              id="income"
              name="income"
              value={answers.income}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="low">Below $20,000</option>
              <option value="medium">$20,000 - $50,000</option>
              <option value="high">Above $50,000</option>
            </select>
          </div>

          {/* Location */}
          <div className="col-md-6">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              placeholder="State / Province"
              value={answers.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <div className="col-12 text-center mt-3">
            <button type="submit" className="btn btn-primary px-4 py-2">
              ✅ Check Eligibility
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EligibilityChecker;
