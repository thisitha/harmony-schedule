import { useState } from 'react';
import { useScheduling } from '@/contexts/SchedulingContext';
import { SlotDetailsModal } from './SlotDetailsModal';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

export function WeeklyGrid() {
  const { state } = useScheduling();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const getSlot = (day: string, time: string) => {
    return state.timeSlots.find((slot) => slot.day === day && slot.time === time);
  };

  const getSlotColor = (filledCount: number, capacity: number) => {
    const percentage = (filledCount / capacity) * 100;
    if (percentage === 100) return 'bg-pastel-coral border-pastel-coral-foreground/20';
    if (percentage >= 80) return 'bg-pale-sunshine border-pale-sunshine-foreground/20';
    return 'bg-pastel-mint border-pastel-mint-foreground/20';
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        <div className="grid grid-cols-6 gap-px bg-border">
          {/* Header row */}
          <div className="bg-secondary p-4 font-semibold text-sm"></div>
          {DAYS.map((day) => (
            <div key={day} className="bg-secondary p-4 font-semibold text-sm text-center">
              {day}
            </div>
          ))}

          {/* Time slots */}
          {TIMES.map((time) => (
            <>
              <div
                key={`time-${time}`}
                className="bg-card p-4 font-medium text-sm text-muted-foreground flex items-center justify-center"
              >
                {time}
              </div>
              {DAYS.map((day) => {
                const slot = getSlot(day, time);
                if (!slot) {
                  return (
                    <div key={`${day}-${time}`} className="bg-muted/30 p-4 text-center">
                      <span className="text-xs text-muted-foreground">No slot</span>
                    </div>
                  );
                }
                const filledCount = slot.students.length;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={cn(
                      'p-4 cursor-pointer transition-all hover:scale-[1.02] border-2',
                      getSlotColor(filledCount, slot.capacity),
                      'bg-card'
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-sm font-semibold border-2',
                          getSlotColor(filledCount, slot.capacity)
                        )}
                      >
                        {filledCount}/{slot.capacity} Spots
                      </div>
                      {filledCount === slot.capacity && (
                        <span className="text-xs font-medium text-pastel-coral-foreground">Full</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {selectedSlotId && (
        <SlotDetailsModal slotId={selectedSlotId} onClose={() => setSelectedSlotId(null)} />
      )}
    </>
  );
}
