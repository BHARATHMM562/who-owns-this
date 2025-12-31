import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TeamCodeDisplayProps {
  code: string;
}

export function TeamCodeDisplay({ code }: TeamCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-border">
      <span className="text-muted-foreground text-sm">Team Code:</span>
      <code className="font-mono text-primary font-semibold tracking-wider">{code}</code>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-primary/10"
        onClick={handleCopy}
      >
        {copied ? (
          <Check size={16} className="text-success" />
        ) : (
          <Copy size={16} className="text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
