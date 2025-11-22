import { MySchedule } from './MySchedule';
import { MakeupBooking } from './MakeupBooking';

export function StudentPortal() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Student Portal</h2>
        <p className="text-muted-foreground">
          View your recurring schedule and book makeup lessons.
        </p>
      </div>

      <MySchedule />
      <MakeupBooking />
    </div>
  );
}
