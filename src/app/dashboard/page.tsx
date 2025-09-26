'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';
import UserDashboard from '@/components/UserDashboard';

export default function Dashboard() {
  const { authenticated, user } = usePrivy();

  // Check onboarding status on mount
  useEffect(() => {
    if (authenticated && user) {
      const onboardingComplete = localStorage.getItem('hanumo_onboarding_complete');
      const userProfile = localStorage.getItem('hanumo_user_profile');
      
      // If no onboarding data exists, redirect to onboarding
      if (!onboardingComplete || !userProfile) {
        console.log('🔄 New user detected, redirecting to onboarding...');
        window.location.href = '/onboarding';
      }
    }
  }, [authenticated, user]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <UserDashboard />
      </div>
    </div>
  );
}
