// Session management for WHO OWNS THIS?

export interface SessionData {
  memberId: string;
  memberName: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  leaderId: string;
}

const SESSION_KEY = 'who_owns_this_session';

export function saveSession(data: SessionData): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function getSession(): SessionData | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isLeader(session: SessionData | null): boolean {
  if (!session) return false;
  return session.memberId === session.leaderId;
}
