import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ name, email, onLogout }) {
  // Message board state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Load the latest messages from the server
  const loadMessages = async () => {
    try {
      const response = await axios.get('/messages');
      setMessages(response.data.messages);
    } catch (err) {
      setError('Error loading messages: ' + (err.response?.data?.message || err.message));
    }
  };

  // Load messages once, when the dashboard first appears
  useEffect(() => {
    loadMessages();
  }, []);

  // Post a new message, using the logged in user's name as the author
  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/messages', { name, text: newMessage });
      setNewMessage('');
      setError('');
      loadMessages(); // Refresh the list so the new message shows up
    } catch (err) {
      setError('Error posting message: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      <div className="user-greeting">
        <h3>Hello, {name}! </h3>
        <p>You've successfully logged in with: {email}</p>
      </div>
      <div className="dashboard-content">
        <h3>Message Board</h3>
        <form onSubmit={handlePost}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
          />
          <button type="submit">Post</button>
        </form>
        {error && <p className="error">{error}</p>}
        <ul className="message-list">
          {messages.map((msg) => (
            <li key={msg.id}>
              <strong>{msg.name}</strong>: {msg.text}
              <span className="message-time">{new Date(msg.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className="logout-btn" onClick={onLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;
