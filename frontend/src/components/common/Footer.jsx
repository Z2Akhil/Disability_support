import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/mobility-assistance" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" }
  ];

  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top border-secondary">
      <div className="container">
        <div className="row g-5">
          {/* Branding & Mission */}
          <div className="col-lg-6">
            <h2 className="h4 fw-bold text-white mb-3">Disability Support Platform</h2>
            <p className="small mb-2">
              Empowering lives with accessibility. We provide support, tools, and community to help individuals with disabilities live independently.
            </p>
            <p className="text-muted small">Building an inclusive future, together.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled small">
              {quickLinks.map((link) => (
                <li key={link.path} className="mb-1">
                  <Link to={link.path} className="text-light text-decoration-none link-hover">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3">
            <h5 className="text-white mb-3">Contact Us</h5>
            <address className="small text-light">
              <div>123 Accessibility Way</div>
              <div>Suite 100</div>
              <div>New York, NY 10001</div>
              <div className="mt-2">
                <a href="mailto:info@disabilitysupport.org" className="text-decoration-none text-light d-block mb-1">
                  info@disabilitysupport.org
                </a>
                <a href="tel:18005550199" className="text-decoration-none text-light">
                  1-800-555-0199
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
       <div className="text-center pt-4 mt-4 border-top border-secondary small footer-text">
       <p className="mb-1">© {currentYear} Disability Support Platform. All rights reserved.</p>
       <p>Built with ❤️ for accessibility | WCAG 2.1 AA Compliant</p>
       </div>
      </div>
    </footer>
  );
};

export default Footer;
