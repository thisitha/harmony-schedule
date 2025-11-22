import { Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  currentView: 'student' | 'admin';
  onViewChange: (view: 'student' | 'admin') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <nav className="bg-card shadow-soft border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-soft-periwinkle to-pastel-mint bg-clip-text text-transparent">
          Music School Scheduler
        </h1>
        <div className="flex gap-2 bg-secondary p-1 rounded-2xl">
          <Button
            variant={currentView === 'student' ? 'default' : 'ghost'}
            onClick={() => onViewChange('student')}
            className="rounded-xl flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Student Portal
          </Button>
          <Button
            variant={currentView === 'admin' ? 'default' : 'ghost'}
            onClick={() => onViewChange('admin')}
            className="rounded-xl flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Admin Dashboard
          </Button>
        </div>
      </div>
    </nav>
  );
}
