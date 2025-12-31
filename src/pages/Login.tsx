import { Logo } from '@/components/Logo';
import { LoginForm } from '@/components/LoginForm';
import { SessionData } from '@/lib/session';

interface LoginPageProps {
  onLogin: (session: SessionData) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo size="sm" />
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4 animate-fade-in">
            <Logo size="lg" />
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Eliminate confusion in group work. Every task has{' '}
              <span className="text-primary font-semibold">exactly one owner</span>.
            </p>
          </div>
          
          {/* Login Form */}
          <LoginForm onLogin={onLogin} />
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs text-muted-foreground">Clear Ownership</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-xs text-muted-foreground">Team Visibility</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-xs text-muted-foreground">Simple & Clean</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-6 text-center text-muted-foreground text-sm">
        <p>Built for clarity. No passwords needed.</p>
      </footer>
    </div>
  );
}
