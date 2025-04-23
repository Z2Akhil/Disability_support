// In components/ui/ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChatWidget = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'You',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
      // Here you would typically send to your backend
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="card shadow-lg" style={{ width: '300px', height: '400px' }}>
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <span>Support Chat</span>
        <button onClick={onClose} className="btn-close btn-close-white btn-sm"></button>
      </div>
      <div className="card-body p-0 d-flex flex-column">
        <div className="flex-grow-1 p-3 overflow-auto" style={{ height: '300px' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`mb-2 ${msg.sender === 'You' ? 'text-end' : ''}`}>
              <div className={`d-inline-block p-2 rounded ${msg.sender === 'You' ? 'bg-primary text-white' : 'bg-light'}`}>
                <small className="d-block fw-bold">{msg.sender}</small>
                {msg.text}
                <small className="d-block text-muted">{msg.timestamp}</small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="border-top p-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;