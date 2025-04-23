import { useState } from 'react';
import DocumentCard from '../components/ui/DocumentCard'; // Make sure it uses Bootstrap
import AskLawyerForm from '../components/ui/AskLawyerForm'; // Should also use Bootstrap

const LegalRights = () => {
  const [activeTopic, setActiveTopic] = useState('workplace');

  const topics = [
    {
      id: 'workplace',
      title: 'Workplace Rights',
      summary: 'Your rights regarding employment, accommodations, and discrimination in the workplace.',
      laws: [
        { name: 'Americans with Disabilities Act (ADA)', summary: 'Prohibits discrimination against individuals with disabilities in all areas of public life.' },
        { name: 'Equal Employment Opportunity', summary: 'Ensures equal opportunity in employment for persons with disabilities.' }
      ],
      faqs: [
        { question: 'What accommodations can I request at work?', answer: 'You can request reasonable accommodations that help you perform essential job functions.' },
        { question: 'Can an employer ask about my disability?', answer: 'Generally no, unless it relates to job accommodations or after a job offer is made.' }
      ]
    },
    {
      id: 'education',
      title: 'Education Rights',
      summary: 'Your rights to accessible education and accommodations in schools.',
      laws: [
        { name: 'Individuals with Disabilities Education Act (IDEA)', summary: 'Ensures services to children with disabilities throughout the nation.' },
        { name: 'Section 504 of the Rehabilitation Act', summary: 'Prohibits discrimination based on disability in programs receiving federal funds.' }
      ],
      faqs: [
        { question: 'What is an IEP?', answer: 'An Individualized Education Program is a plan developed for each public school child who needs special education.' }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare Rights',
      summary: 'Your rights regarding accessible healthcare and medical discrimination.',
      laws: [
        { name: 'Affordable Care Act (ACA)', summary: 'Prohibits health insurers from discriminating based on disability.' }
      ],
      faqs: []
    }
  ];

  const documents = [
    { id: 1, title: "ADA Guide for Employees", format: "PDF", size: "2.4 MB", language: "English" },
    { id: 2, title: "Know Your Education Rights", format: "Audio", size: "15 min", language: "English, Spanish" },
    { id: 3, title: "Healthcare Accessibility Laws", format: "Text", size: "1.1 MB", language: "English" }
  ];

  const activeTopicData = topics.find(topic => topic.id === activeTopic);

  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold mb-4">Legal & Rights Awareness</h1>

      {/* Topic Tabs */}
      <ul className="nav nav-tabs mb-4">
        {topics.map(topic => (
          <li className="nav-item" key={topic.id}>
            <button
              className={`nav-link ${activeTopic === topic.id ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic.id)}
            >
              {topic.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Topic Content */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">{activeTopicData.title}</h2>
        <p className="mb-4">{activeTopicData.summary}</p>

        <div className="row g-4">
          {/* Main content */}
          <div className="col-lg-8">
            {/* Laws */}
            <h3 className="h5 fw-semibold mb-3">Relevant Laws</h3>
            {activeTopicData.laws.map((law, index) => (
              <div className="card mb-3 shadow-sm" key={index}>
                <div className="card-body">
                  <h5 className="card-title fw-semibold">{law.name}</h5>
                  <p className="card-text">{law.summary}</p>
                </div>
              </div>
            ))}

            {/* FAQs */}
            <h3 className="h5 fw-semibold mt-4 mb-3">Frequently Asked Questions</h3>
            {activeTopicData.faqs.length > 0 ? (
              activeTopicData.faqs.map((faq, index) => (
                <div className="card mb-3 shadow-sm" key={index}>
                  <div className="card-body">
                    <h6 className="fw-semibold">{faq.question}</h6>
                    <p className="mb-0">{faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No FAQs available for this topic yet.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <h5 className="fw-semibold mb-3">Legal Aid Contacts</h5>
            <div className="bg-primary bg-opacity-10 p-3 rounded mb-4">
              <p className="fw-semibold mb-1">Disability Rights Legal Center</p>
              <p className="text-primary mb-0">1-800-555-0199</p>
              <small className="text-muted">Mon-Fri, 9am–5pm</small>
            </div>

            <h5 className="fw-semibold mb-3">Downloadable Resources</h5>
            <div className="d-grid gap-3">
              {documents.map(doc => (
                <DocumentCard
                  key={doc.id}
                  title={doc.title}
                  format={doc.format}
                  size={doc.size}
                  language={doc.language}
                  onDownload={() => console.log(`Downloading ${doc.title}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ask a Lawyer Section */}
      <section className="bg-light p-4 rounded shadow-sm">
        <h2 className="h4 fw-bold mb-3">Ask a Legal Question</h2>
        <AskLawyerForm />
      </section>
    </div>
  );
};

export default LegalRights;
