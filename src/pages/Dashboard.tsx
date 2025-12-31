import { useEffect, useState, useCallback } from 'react';
import { LogOut, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { TeamCodeDisplay } from '@/components/TeamCodeDisplay';
import { MembersList } from '@/components/MembersList';
import { TaskTable } from '@/components/TaskTable';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { getMembers, getTasks, Member, Task } from '@/lib/api';
import { SessionData } from '@/lib/session';
import { toast } from 'sonner';

interface DashboardPageProps {
  session: SessionData;
  isLeader: boolean;
  onLogout: () => void;
}

export function DashboardPage({ session, isLeader, onLogout }: DashboardPageProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const [membersData, tasksData] = await Promise.all([
        getMembers(session.teamId),
        getTasks(session.teamId),
      ]);
      setMembers(membersData);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load data. Is your backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session.teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => fetchData(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse-glow w-12 h-12 rounded-full bg-primary/20 mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-4">
            <TeamCodeDisplay code={session.teamCode} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="hover:bg-muted"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive hover:border-destructive"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Team Info */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-mono font-bold mb-2">{session.teamName}</h2>
          <p className="text-muted-foreground">
            Welcome back, <span className="text-primary font-medium">{session.memberName}</span>
            {isLeader && <span className="text-warning ml-2">(Leader)</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Members */}
          <div className="lg:col-span-1 animate-slide-in-right">
            <MembersList members={members} leaderId={session.leaderId} />
          </div>

          {/* Main - Tasks */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-semibold text-lg">Tasks</h3>
              {isLeader && (
                <CreateTaskDialog
                  teamId={session.teamId}
                  leaderId={session.leaderId}
                  members={members}
                  onTaskCreated={handleRefresh}
                />
              )}
            </div>
            
            <TaskTable
              tasks={tasks}
              members={members}
              currentMemberId={session.memberId}
              onTaskUpdated={handleRefresh}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
