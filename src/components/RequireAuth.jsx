// src/components/RequireAuth.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function RequireAuth({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
    });
  }, []);

  if (authenticated === null) return <div>Checking login…</div>;
  return authenticated ? children : <Navigate to="/login" replace />;
}
