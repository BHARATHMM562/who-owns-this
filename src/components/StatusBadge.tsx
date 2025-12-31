import { cn } from '@/lib/utils';

type Status = 'Not Started' | 'In Progress' | 'Completed';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    'Not Started': 'bg-muted text-muted-foreground border-muted',
    'In Progress': 'bg-warning/10 text-warning border-warning/30',
    'Completed': 'bg-success/10 text-success border-success/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
