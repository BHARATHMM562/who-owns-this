import { useState, useEffect, useCallback } from 'react';
import { SessionData, getSession, saveSession, clearSession, isLeader } from '@/lib/session';

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getSession();
    setSession(stored);
    setLoading(false);
  }, []);

  const login = useCallback((data: SessionData) => {
    saveSession(data);
    setSession(data);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return {
    session,
    loading,
    isLoggedIn: !!session,
    isLeader: isLeader(session),
    login,
    logout,
  };
}
