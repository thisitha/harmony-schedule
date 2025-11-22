import { WeeklyGrid } from './WeeklyGrid';

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage all time slots and student bookings. Click any slot to view details.
        </p>
      </div>

      <WeeklyGrid />
    </div>
  );
}
