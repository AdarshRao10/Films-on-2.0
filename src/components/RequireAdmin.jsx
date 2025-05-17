// src/components/RequireAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState({
    initializing: true,
    session: null
  });

  useEffect(() => {
    // 1) get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus({ initializing: false, session });
    });

    // 2) subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setStatus({ initializing: false, session });
      }
    );

    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (status.initializing) {
    return <div>Checking authentication…</div>;
  }

  if (!status.session) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  const role = status.session.user.user_metadata?.role;
  if (role !== 'admin') {
    // logged in, but not an admin
    return <Navigate to="/" replace />;
  }

  // OK!
  return children;
}
