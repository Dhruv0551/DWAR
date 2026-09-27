import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (profile && !profile.is_onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
