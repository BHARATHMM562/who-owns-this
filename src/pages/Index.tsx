import { useSession } from '@/hooks/useSession';
import { LoginPage } from './Login';
import { DashboardPage } from './Dashboard';

const Index = () => {
  const { session, loading, isLeader, login, logout } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow w-16 h-16 rounded-full bg-primary/20" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <DashboardPage
      session={session}
      isLeader={isLeader}
      onLogout={logout}
    />
  );
};

export default Index;
