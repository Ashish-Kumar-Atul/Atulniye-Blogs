import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from './Loading'

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();

  if (loading) return <Loading/>;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
