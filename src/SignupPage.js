import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Wahi purani CSS file use karenge

const API_URL = 'http://34.74.243.207:5000';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Signup successful! Please log in.');
        navigate('/login'); // Login page par bhej dein
      } else {
        alert(data.error || 'Signup failed!');
      }
    } catch (error) {
      alert('An error occurred during signup.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="auth-button">Sign Up</button>
        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;