import { Users, Crown } from 'lucide-react';
import { Member } from '@/lib/api';

interface MembersListProps {
  members: Member[];
  leaderId: string;
}

export function MembersList({ members, leaderId }: MembersListProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-primary" />
        <h3 className="font-mono font-semibold">Team Members</h3>
        <span className="text-muted-foreground text-sm">({members.length})</span>
      </div>
      
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.memberId}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
          >
            {member.memberId === leaderId && (
              <Crown size={14} className="text-warning" />
            )}
            <span className="text-sm">{member.name}</span>
            {member.memberId === leaderId && (
              <span className="text-xs text-muted-foreground">(Leader)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
