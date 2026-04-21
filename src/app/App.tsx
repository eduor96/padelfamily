import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { BookingCalendar } from './components/BookingCalendar';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { LandingPage } from './components/LandingPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { getSession, clearSession, Member } from '../utils/supabase';
import { getAdminSession, clearAdminSession } from '../utils/admin';

type UserType = 'member' | 'admin' | null;

export default function App() {
  const [member, setMember] = useState<Member | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'bookings'>('home');
  const [showLanding, setShowLanding] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing sessions
    const adminSession = getAdminSession();
    if (adminSession) {
      setUserType('admin');
      setShowLanding(false);
      setLoading(false);
      return;
    }

    const memberSession = getSession();
    if (memberSession) {
      setMember(memberSession.member);
      setUserId(memberSession.userId);
      setAccessToken(memberSession.accessToken);
      setUserType('member');
      setShowLanding(false);
    }
    setLoading(false);
  }, []);

  const handleMemberLogin = (newMember: Member, newUserId: string, newAccessToken: string) => {
    setMember(newMember);
    setUserId(newUserId);
    setAccessToken(newAccessToken);
    setUserType('member');
    setShowLanding(false);
  };

  const handleAdminLogin = () => {
    setUserType('admin');
    setShowAdminLogin(false);
    setShowLanding(false);
  };

  const handleLogout = () => {
    if (userType === 'admin') {
      clearAdminSession();
      setUserType(null);
    } else {
      setMember(null);
      setUserId(null);
      setAccessToken(null);
      clearSession();
      setUserType(null);
    }
    setCurrentView('home');
    setShowLanding(true);
    setShowAdminLogin(false);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setShowAdminLogin(false);
  };

  const handleAdminClick = () => {
    setShowLanding(false);
    setShowAdminLogin(true);
  };

  const handleBackToLanding = () => {
    setShowAdminLogin(false);
    setShowLanding(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Admin flow
  if (userType === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  // Landing page
  if (showLanding && !member) {
    return <LandingPage onGetStarted={handleGetStarted} onAdminClick={handleAdminClick} />;
  }

  // Member login
  if (!member || !userId) {
    return <Login onLogin={handleMemberLogin} />;
  }

  // Member dashboard
  return (
    <div className="min-h-screen">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        username={member.nombre}
      />
      {currentView === 'home' ? (
        <Home />
      ) : (
        <BookingCalendar memberId={userId} memberName={member.nombre} />
      )}
    </div>
  );
}