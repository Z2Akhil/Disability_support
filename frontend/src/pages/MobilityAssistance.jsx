import { useState } from 'react';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import Card from '../components/ui/Card';
import ReviewCard from '../components/ui/ReviewCard';

const MobilityAssistance = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const services = [
    {
      id: 1,
      title: "Accessible Transport",
      description: "Find wheelchair-accessible taxis and public transport options near you.",
      category: "transport",
      image: "/images/transport.jpg"
    },
    // Add more services...
  ];

  const reviews = [
    {
      id: 1,
      author: "Jane D.",
      rating: 5,
      comment: "Found a great wheelchair rental service through this platform. Very helpful!",
      date: "2023-05-15"
    },
    // Add more reviews...
  ];

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-4">Mobility Assistance</h1>

      <div className="mb-5">
        <div className="btn-group flex-wrap mb-4" role="group">
          {['all', 'transport', 'rentals', 'home-modifications'].map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`btn ${activeFilter === category ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {category === 'all'
                ? 'All Services'
                : category.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {filteredServices.map(service => (
            <div key={service.id} className="col-sm-6 col-lg-4">
              <Card 
                title={service.title}
                description={service.description}
                image={service.image}
                actionText="View Details"
                onAction={() => console.log(`Viewing ${service.title}`)}
              />
            </div>
          ))}
        </div>
      </div>

      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Step-by-Step Guides</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Making Your Home Accessible</h5>
            <ol className="ps-3">
              <li>Assess your current living space for barriers</li>
              <li>Prioritize modifications based on your needs</li>
              <li>Consult with an accessibility specialist</li>
              <li>Apply for financial assistance if needed</li>
              <li>Implement modifications in phases</li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <h2 className="h4 fw-bold mb-3">User Experiences</h2>
        <div className="d-flex flex-column gap-3">
          {reviews.map(review => (
            <ReviewCard 
              key={review.id}
              author={review.author}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
            />
          ))}
        </div>
      </section>

      <FloatingActionButton 
        icon="🎤" 
        onClick={() => console.log("Voice assistance activated")}
        label="Voice Navigation"
      />
    </div>
  );
};

export default MobilityAssistance;
