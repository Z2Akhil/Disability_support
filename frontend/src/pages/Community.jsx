import { useState } from 'react';
import PostCard from '../components/ui/PostCard';
import EventCalendar from '../components/ui/EventCalendar';
import FloatingActionButton from '../components/ui/FloatingActionButton';

const Community = () => {
  const [activeTab, setActiveTab] = useState('forum');
  const [newPostContent, setNewPostContent] = useState('');

  const forumPosts = [
    {
      id: 1,
      author: "Alex M.",
      avatar: "A",
      title: "Tips for Accessible Travel",
      content: "Sharing my experiences traveling with a wheelchair in Europe...",
      date: "2023-06-10",
      replies: 12,
      likes: 34
    },
    // More posts...
  ];

  const events = [
    {
      id: 1,
      title: "Virtual Support Group Meeting",
      date: "2023-06-15",
      time: "7:00 PM",
      type: "online",
      attendees: 24
    },
    // More events...
  ];

  const stories = [
    {
      id: 1,
      title: "My Journey to Independence",
      author: "Jamie R.",
      excerpt: "How I learned to adapt and thrive after my accident...",
      date: "2023-05-20"
    },
    // More stories...
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      console.log("Posting:", newPostContent);
      setNewPostContent('');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-4 text-center">Community</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'forum' ? 'active' : ''}`} 
            onClick={() => setActiveTab('forum')}
          >
            Forum
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'events' ? 'active' : ''}`} 
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'stories' ? 'active' : ''}`} 
            onClick={() => setActiveTab('stories')}
          >
            Stories
          </button>
        </li>
      </ul>

      {/* Forum Tab */}
      {activeTab === 'forum' && (
        <>
          <form onSubmit={handlePostSubmit} className="mb-5 card card-body shadow-sm">
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Start a new discussion..."
                rows="3"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-image"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-emoji-smile"></i>
                </button>
              </div>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={!newPostContent.trim()}
              >
                Post
              </button>
            </div>
          </form>

          <div className="row g-4">
            {forumPosts.map(post => (
              <div className="col-12" key={post.id}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="row g-4">
          <div className="col-lg-8">
            <EventCalendar events={events} />
          </div>
          <div className="col-lg-4">
            <h3 className="h5 mb-3">Upcoming Events</h3>
            {events.map(event => (
              <div className="card p-3 mb-3 shadow-sm" key={event.id}>
                <h5>{event.title}</h5>
                <p className="text-muted mb-1">
                  {event.date} at {event.time} • {event.type === 'online' ? 'Online' : 'In-Person'}
                </p>
                <small className="text-secondary">{event.attendees} attending</small>
                <button className="btn btn-sm btn-outline-primary mt-2">RSVP</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="row g-4">
          {stories.map(story => (
            <div className="col-md-6" key={story.id}>
              <div className="card p-4 shadow-sm h-100">
                <h5 className="card-title">{story.title}</h5>
                <p className="text-muted small mb-2">By {story.author} • {story.date}</p>
                <p>{story.excerpt}</p>
                <button className="btn btn-link text-primary p-0">Read Full Story</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Chat */}
      <FloatingActionButton 
        icon="💬" 
        onClick={() => console.log("Starting peer chat")}
        label="Peer Chat"
      />
    </div>
  );
};

export default Community;
