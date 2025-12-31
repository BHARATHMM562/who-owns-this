import { format } from 'date-fns';
import { Task, Member, updateTaskStatus } from '@/lib/api';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ClipboardList } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  members: Member[];
  currentMemberId: string;
  onTaskUpdated: () => void;
}

export function TaskTable({ tasks, members, currentMemberId, onTaskUpdated }: TaskTableProps) {
  const getMemberName = (ownerId: string) => {
    const member = members.find((m) => m.memberId === ownerId);
    return member?.name || 'Unknown';
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      await updateTaskStatus(task.taskId, newStatus, currentMemberId);
      toast.success('Task status updated');
      onTaskUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  const canEditTask = (task: Task) => task.ownerId === currentMemberId;

  if (tasks.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <ClipboardList size={48} className="mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-mono">Task</TableHead>
            <TableHead className="font-mono">Owner</TableHead>
            <TableHead className="font-mono">Deadline</TableHead>
            <TableHead className="font-mono">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow
              key={task.taskId}
              className="border-border animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <span className={task.ownerId === currentMemberId ? 'text-primary font-medium' : ''}>
                  {getMemberName(task.ownerId)}
                  {task.ownerId === currentMemberId && ' (You)'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(task.deadline), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {canEditTask(task) ? (
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleStatusChange(task, value as Task['status'])}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
