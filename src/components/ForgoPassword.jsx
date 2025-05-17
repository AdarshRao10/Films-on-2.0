// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import supabase from '../supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage('Check your inbox for a link to reset your password.');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', margin: '0.5rem 0' }}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
