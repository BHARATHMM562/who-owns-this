import { useState } from 'react';
import { UserPlus, LogIn, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createTeam, joinTeam } from '@/lib/api';
import { SessionData } from '@/lib/session';
import { toast } from 'sonner';

interface LoginFormProps {
  onLogin: (session: SessionData) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [createName, setCreateName] = useState('');
  const [createTeamName, setCreateTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim() || !joinCode.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const { team, member } = await joinTeam(joinName.trim(), joinCode.trim().toUpperCase());
      onLogin({
        memberId: member.memberId,
        memberName: member.name,
        teamId: team.teamId,
        teamName: team.teamName,
        teamCode: team.teamCode,
        leaderId: team.leaderId,
      });
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createTeamName.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const { team, member } = await createTeam(createTeamName.trim(), createName.trim());
      onLogin({
        memberId: member.memberId,
        memberName: member.name,
        teamId: team.teamId,
        teamName: team.teamName,
        teamCode: team.teamCode,
        leaderId: team.leaderId,
      });
      toast.success(`Team created! Your code is: ${team.teamCode}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-scale-in">
      <Tabs defaultValue="join" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="join" className="font-mono">
            <LogIn size={16} className="mr-2" />
            Join Team
          </TabsTrigger>
          <TabsTrigger value="create" className="font-mono">
            <UserPlus size={16} className="mr-2" />
            Create Team
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="join">
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="p-6 bg-card border border-border rounded-lg space-y-4 gradient-border">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-primary" />
                <h2 className="font-mono font-semibold">Join Existing Team</h2>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="join-name">Your Name</Label>
                <Input
                  id="join-name"
                  placeholder="Enter your name..."
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="join-code">Team Code</Label>
                <Input
                  id="join-code"
                  placeholder="Enter team code..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="bg-muted font-mono tracking-wider"
                  maxLength={8}
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Joining...' : (
                  <>
                    Join Team
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="create">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="p-6 bg-card border border-border rounded-lg space-y-4 gradient-border">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus size={20} className="text-accent" />
                <h2 className="font-mono font-semibold">Create New Team</h2>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-name">Your Name (Leader)</Label>
                <Input
                  id="create-name"
                  placeholder="Enter your name..."
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-team">Team Name</Label>
                <Input
                  id="create-team"
                  placeholder="Enter team name..."
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  className="bg-muted"
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Creating...' : (
                  <>
                    Create Team
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
