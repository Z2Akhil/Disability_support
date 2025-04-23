import { useState } from 'react';
import Accordion from '../components/ui/Accordion'; // Assuming already Bootstrap-styled
import EligibilityChecker from '../components/ui/EligibilityChecker'; // Assume styled

const GovernmentPrograms = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const programs = [
    {
      id: 1,
      title: "Disability Living Allowance",
      category: "financial",
      description: "Financial support for extra costs because of a long-term illness or disability.",
      eligibility: "Aged 16-64, meets disability requirements",
      applicationLink: "https://www.gov.uk/dla-disability-living-allowance-benefit",
      documents: ["Application Form", "Guidance Notes"]
    },
    {
      id: 2,
      title: "Access to Work",
      category: "employment",
      description: "Grants to help pay for practical support to help you start or stay in work.",
      eligibility: "Employed or about to start work, have a disability or health condition",
      applicationLink: "https://www.gov.uk/access-to-work",
      documents: ["Application Pack", "Case Studies"]
    },
    {
      id: 3,
      title: "Disabled Facilities Grant",
      category: "housing",
      description: "Funding for home adaptations to help you live independently.",
      eligibility: "Homeowner or tenant, assessment shows adaptations are necessary",
      applicationLink: "https://www.gov.uk/disabled-facilities-grants",
      documents: ["Grant Form", "Architect Guidelines"]
    },
    {
      id: 4,
      title: "Personal Independence Payment",
      category: "financial",
      description: "Help with some of the extra costs caused by long-term disability or illness.",
      eligibility: "Aged 16-64, difficulties with daily living or mobility",
      applicationLink: "https://www.gov.uk/pip",
      documents: ["Claim Form", "Medical Evidence Guide"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'financial', name: 'Financial Support' },
    { id: 'employment', name: 'Employment' },
    { id: 'housing', name: 'Housing' },
    { id: 'education', name: 'Education' }
  ];

  const hotlines = [
    {
      name: "Disability Benefits Helpline",
      number: "1-800-555-0199",
      hours: "Mon-Fri, 8am-6pm"
    },
    {
      name: "Employment Rights Hotline",
      number: "1-800-555-0123",
      hours: "24/7"
    },
    {
      name: "Housing Adaptation Support",
      number: "1-800-555-0178",
      hours: "Mon-Fri, 9am-5pm"
    }
  ];

  const filteredPrograms = activeCategory === 'all'
    ? programs
    : programs.filter(program => program.category === activeCategory);

  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold mb-4 text-center">Government Programs</h1>

      {/* Eligibility Checker */}
      <section className="mb-5">
        <EligibilityChecker />
      </section>

      {/* Category Filters */}
      <section className="mb-5">
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`btn ${activeCategory === category.id ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Program Accordions */}
        <div className="accordion" id="programsAccordion">
          {filteredPrograms.map((program, idx) => (
            <div className="accordion-item mb-3 shadow-sm" key={program.id}>
              <h2 className="accordion-header" id={`heading-${program.id}`}>
                <button
                  className="accordion-button collapsed fw-semibold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${program.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${program.id}`}
                >
                  {program.title} <small className="ms-3 text-muted">({categories.find(c => c.id === program.category)?.name})</small>
                </button>
              </h2>
              <div
                id={`collapse-${program.id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${program.id}`}
                data-bs-parent="#programsAccordion"
              >
                <div className="accordion-body">
                  <div className="row g-4">
                    <div className="col-md-8">
                      <h5>Description</h5>
                      <p>{program.description}</p>

                      <h5>Eligibility</h5>
                      <p>{program.eligibility}</p>
                    </div>
                    <div className="col-md-4">
                      <h5>Documents</h5>
                      <ul className="list-unstyled mb-3">
                        {program.documents.map((doc, index) => (
                          <li key={index} className="d-flex align-items-center mb-2">
                            <i className="bi bi-file-earmark me-2 text-secondary"></i>
                            {doc}
                            <button className="btn btn-link btn-sm ms-auto text-decoration-none">Download</button>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={program.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success w-100 mb-2"
                      >
                        Apply Online
                      </a>
                      <button className="btn btn-primary w-100">Save for Later</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Contacts */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Important Contacts</h2>
        <div className="row g-4">
          {hotlines.map((hotline, index) => (
            <div key={index} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{hotline.name}</h5>
                  <p className="fs-4 text-primary fw-bold">{hotline.number}</p>
                  <p className="text-muted small mb-0">Hours: {hotline.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GovernmentPrograms;
