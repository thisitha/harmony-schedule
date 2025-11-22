import { Calendar, Clock } from 'lucide-react';
import { useScheduling } from '@/contexts/SchedulingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MySchedule() {
  const { state } = useScheduling();
  const recurringSlot = state.timeSlots.find(
    (slot) => slot.id === state.currentStudent.recurringSlot
  );

  return (
    <Card className="rounded-2xl shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-soft-periwinkle" />
          My Recurring Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recurringSlot ? (
          <div className="bg-soft-periwinkle/20 border-2 border-soft-periwinkle rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-soft-periwinkle flex items-center justify-center">
                <Clock className="h-6 w-6 text-soft-periwinkle-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Every {recurringSlot.day}</p>
                <p className="text-2xl font-bold">{recurringSlot.time}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            You don't have a recurring slot scheduled yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
