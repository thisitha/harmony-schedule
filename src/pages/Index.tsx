import { useState } from 'react';
import { SchedulingProvider } from '@/contexts/SchedulingContext';
import { ViewToggle } from '@/components/ViewToggle';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { StudentPortal } from '@/components/student/StudentPortal';

const Index = () => {
  const [currentView, setCurrentView] = useState<'student' | 'admin'>('student');

  return (
    <SchedulingProvider>
      <div className="min-h-screen bg-background">
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="pb-8">
          {currentView === 'admin' ? <AdminDashboard /> : <StudentPortal />}
        </main>
      </div>
    </SchedulingProvider>
  );
};

export default Index;
