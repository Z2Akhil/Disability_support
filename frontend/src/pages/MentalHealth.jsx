import { useState } from 'react';
import TherapistCard from '../components/ui/TherapistCard';
import AudioPlayer from '../components/ui/AudioPlayer';
import FloatingActionButton from '../components/ui/FloatingActionButton';

const MentalHealth = () => {
  const [activeTab, setActiveTab] = useState('therapists');
  const [anonymousChatOpen, setAnonymousChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const therapists = [
    { id: 1, name: "Dr. Lisa Thompson", photo: "/images/therapist1.jpg", specialty: "Disability-Related Anxiety", approach: "Cognitive Behavioral Therapy", acceptsInsurance: true, telemedicine: true, rating: 4.8 },
    { id: 2, name: "Dr. Raj Patel", photo: "/images/therapist2.jpg", specialty: "Chronic Illness Depression", approach: "Mindfulness-Based Therapy", acceptsInsurance: false, telemedicine: true, rating: 4.6 },
    { id: 3, name: "Dr. Sarah Johnson", photo: "/images/therapist3.jpg", specialty: "Trauma and Disability", approach: "EMDR Therapy", acceptsInsurance: true, telemedicine: false, rating: 4.9 }
  ];

  const meditations = [
    { id: 1, title: "Calming Anxiety", duration: "10:24", category: "anxiety", description: "Guided meditation for moments of high anxiety", audioSrc: "/audio/meditation1.mp3" },
    { id: 2, title: "Body Scan Relaxation", duration: "15:42", category: "relaxation", description: "Progressive relaxation technique for chronic pain", audioSrc: "/audio/meditation2.mp3" },
    { id: 3, title: "Sleep Preparation", duration: "22:18", category: "sleep", description: "Wind down your mind for better sleep", audioSrc: "/audio/meditation3.mp3" }
  ];

  const tips = [
    { id: 1, title: "Managing Chronic Pain Stress", content: "Chronic pain can lead to emotional distress. Try these mindfulness techniques to manage the psychological impact..." },
    { id: 2, title: "Coping with Disability-Related Anxiety", content: "Anxiety about your condition or future is common. Grounding techniques can help bring you back to the present..." },
    { id: 3, title: "Building Emotional Resilience", content: "Developing resilience helps you adapt to challenges. Practice self-compassion and celebrate small victories..." }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Sending anonymous message:", chatMessage);
      setChatMessage('');
      setAnonymousChatOpen(false);
      alert("Your message has been sent to a trained volunteer. You'll receive a response shortly.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold mb-4">Mental Health & Emotional Support</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'therapists' ? 'active' : ''}`} onClick={() => setActiveTab('therapists')}>
            Therapists
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
            Resources
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>
            Success Stories
          </button>
        </li>
      </ul>

      {activeTab === 'therapists' && (
        <>
          <section className="mb-5">
            <h2 className="h4 mb-3">Find a Therapist</h2>
            <div className="row g-4">
              {therapists.map(t => (
                <div className="col-md-6 col-lg-4" key={t.id}>
                  <TherapistCard {...t} onBook={() => console.log(`Booking ${t.name}`)} />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-light p-4 rounded mb-4">
            <h2 className="h4 mb-3">Need Immediate Help?</h2>
            <div className="row">
              <div className="col-md-6">
                <h5>Crisis Hotlines</h5>
                <ul className="list-unstyled">
                  <li><strong>National Suicide Prevention:</strong> <span className="text-primary">1-800-273-8255</span></li>
                  <li><strong>Disability Crisis Line:</strong> <span className="text-primary">1-800-555-0199</span></li>
                  <li><strong>24/7 Counseling:</strong> <span className="text-primary">1-800-555-0123</span></li>
                </ul>
              </div>
              <div className="col-md-6">
                <h5>Anonymous Support Chat</h5>
                <p>Talk to a trained volunteer about what you're experiencing.</p>
                <button className="btn btn-primary" onClick={() => setAnonymousChatOpen(true)}>
                  Start Anonymous Chat
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'resources' && (
        <div className="mb-5">
          <section className="mb-4">
            <h2 className="h4 mb-3">Meditation & Relaxation</h2>
            <div className="row g-4">
              {meditations.map(med => (
                <div className="col-md-6 col-lg-4" key={med.id}>
                  <AudioPlayer {...med} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="h4 mb-3">Mental Health Tips</h2>
            <div className="row g-4">
              {tips.map(tip => (
                <div className="col-md-6 col-lg-4" key={tip.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{tip.title}</h5>
                      <p className="card-text">{tip.content}</p>
                      <button className="btn btn-link p-0">Read More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'stories' && (
        <section className="mb-5">
          <h2 className="h4 mb-4">Success Stories</h2>
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Finding Strength in Community</h5>
              <p className="card-text">"After my accident, I felt completely alone..." - Jamie R.</p>
              <div className="d-flex gap-2">
                <button className="btn btn-primary">Read Full Story</button>
                <button className="btn btn-outline-primary">Share Your Story</button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Overcoming Anxiety</h5>
                  <p>"The meditation resources helped me..." - Taylor M.</p>
                  <button className="btn btn-link p-0">Read More</button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Therapy Breakthrough</h5>
                  <p>"Finding a therapist who specializes..." - Alex K.</p>
                  <button className="btn btn-link p-0">Read More</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {anonymousChatOpen && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="card shadow border border-primary" style={{ width: '24rem' }}>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span>Anonymous Support Chat</span>
              <button onClick={() => setAnonymousChatOpen(false)} className="btn-close btn-close-white btn-sm" />
            </div>
            <div className="card-body">
              <p>You're chatting anonymously with a trained volunteer. What would you like to talk about?</p>
              <form onSubmit={handleSendMessage}>
                <textarea
                  className="form-control mb-2"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  rows="3"
                  placeholder="Type your message..."
                  required
                />
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
              </form>
              <p className="text-muted small mt-2">This is not a crisis service. For immediate help, call the hotline.</p>
            </div>
          </div>
        </div>
      )}

      <FloatingActionButton
        icon="🆘"
        onClick={() => window.location.href = 'tel:1-800-273-8255'}
        label="Emergency Help"
      />
    </div>
  );
};

export default MentalHealth;
