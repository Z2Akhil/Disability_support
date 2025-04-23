import { useState } from 'react';

const AskLawyerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
    anonymous: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting legal question:", formData);
    // Integrate your API here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mt-5 bg-white border rounded-4 shadow-sm p-4 p-md-5"
      style={{ maxWidth: '700px' }}
    >
      <h2 className="mb-4 fw-bold text-primary">Ask a Lawyer</h2>

      {!formData.anonymous && (
        <>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address <span className="text-danger">*</span></label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
        </>
      )}

      <div className="mb-3">
        <label htmlFor="question" className="form-label">Your Legal Question <span className="text-danger">*</span></label>
        <textarea
          className="form-control"
          id="question"
          name="question"
          rows={5}
          value={formData.question}
          onChange={handleChange}
          placeholder="Type your legal question here..."
          required
        ></textarea>
      </div>

      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="anonymous"
          name="anonymous"
          checked={formData.anonymous}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="anonymous">
          Ask anonymously (your name and email will not be shared)
        </label>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <p className="text-muted small mb-3 mb-md-0">
          A legal expert will respond within 2 business days.
        </p>
        <button
          type="submit"
          className="btn btn-primary px-4 py-2 shadow-sm"
        >
          Submit Question
        </button>
      </div>
    </form>
  );
};

export default AskLawyerForm;
