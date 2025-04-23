import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to submit form', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-success mx-auto" style={{ maxWidth: "600px" }} role="alert">
          <strong>Thank you!</strong> Your message has been sent. We'll respond within 24-48 hours.
        </div>
        <button
          onClick={() => setIsSubmitted(false)}
          className="btn btn-primary mt-3"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-5 display-5 fw-bold">Contact Us</h1>

      <div className="row g-5">
        {/* Message Form */}
        <div className="col-lg-6">
          <h2 className="h4 fw-semibold mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject</label>
              <select
                id="subject"
                name="subject"
                className="form-select"
                required
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership Opportunities</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="col-lg-6">
          <h2 className="h4 fw-semibold mb-4">Contact Information</h2>
          <div className="p-4 border rounded bg-light">
            <div className="mb-4">
              <h5 className="fw-bold mb-1">Email</h5>
              <p className="text-primary">support@disabilityhelp.org</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold mb-1">Phone</h5>
              <p className="text-primary">1-800-555-0199</p>
              <p className="text-muted small">Monday-Friday, 9am-5pm EST</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold mb-1">Address</h5>
              <p className="mb-0">123 Accessibility Way</p>
              <p className="mb-0">Suite 100</p>
              <p className="mb-0">New York, NY 10001</p>
            </div>

            <div>
              <h5 className="fw-bold mb-2">Accessibility Support</h5>
              <p className="mb-3">Need help using our contact form? Try alternative contact methods:</p>
              <ul className="list-unstyled">
                <li>📞 Voice call assistance: 1-800-555-0200</li>
                <li>✉️ Mail: PO Box 1234, NY 10001</li>
                <li>🎥 Video call appointments available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
