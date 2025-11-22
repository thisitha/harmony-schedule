import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScheduling } from '@/contexts/SchedulingContext';
import { SlotDetailsModal } from './SlotDetailsModal';
import { CapacityIndicator } from '@/components/CapacityIndicator';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

export function WeeklyGrid() {
  const { state } = useScheduling();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const getSlot = (day: string, time: string) => {
    return state.timeSlots.find((slot) => slot.day === day && slot.time === time);
  };

  const getSlotStyles = (filledCount: number, capacity: number) => {
    const percentage = (filledCount / capacity) * 100;
    if (percentage === 100) {
      return {
        borderColor: 'border-peach-200',
        bgColor: 'bg-peach-50/50',
        textColor: 'text-peach-700',
      };
    }
    if (percentage >= 80) {
      return {
        borderColor: 'border-peach-100',
        bgColor: 'bg-gradient-to-br from-peach-50/30 to-transparent',
        textColor: 'text-peach-600',
      };
    }
    return {
      borderColor: 'border-mint-200',
      bgColor: 'bg-gradient-to-br from-mint-50/30 to-transparent',
      textColor: 'text-mint-700',
    };
  };

  return (
    <>
      <div className="space-y-6">
        {TIMES.map((time, timeIndex) => (
          <motion.div
            key={time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: timeIndex * 0.05 }}
          >
            <div className="flex items-start gap-4">
              {/* Time Label */}
              <div className="w-24 flex-shrink-0 pt-3">
                <p className="text-sm font-bold text-foreground">{time}</p>
              </div>

              {/* Slots */}
              <div className="flex-1 grid grid-cols-5 gap-4">
                {DAYS.map((day) => {
                  const slot = getSlot(day, time);
                  if (!slot) {
                    return (
                      <div key={`${day}-${time}`} className="aspect-[4/3]">
                        <Card className="h-full bg-muted/30 border-dashed border-2 border-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No slot</span>
                        </Card>
                      </div>
                    );
                  }

                  const filledCount = slot.students.length;
                  const isFull = filledCount >= slot.capacity;
                  const spotsOpen = slot.capacity - filledCount;
                  const styles = getSlotStyles(filledCount, slot.capacity);

                  return (
                    <motion.div
                      key={slot.id}
                      whileHover={{ scale: isFull ? 1 : 1.02 }}
                      whileTap={{ scale: isFull ? 1 : 0.98 }}
                      className="aspect-[4/3]"
                    >
                      <Card
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={cn(
                          'h-full cursor-pointer transition-all duration-200 p-4 border-2',
                          styles.borderColor,
                          styles.bgColor,
                          isFull && 'opacity-75 cursor-not-allowed'
                        )}
                      >
                        <div className="h-full flex flex-col justify-between">
                          {/* Header */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-xs font-semibold text-muted-foreground truncate">
                                {day.substring(0, 3)}
                              </p>
                              {isFull && (
                                <Lock className="h-3 w-3 text-peach-600" />
                              )}
                            </div>
                            
                            {!isFull && spotsOpen <= 2 && spotsOpen > 0 && (
                              <div className="bg-peach-100 text-peach-700 text-xs font-bold px-2 py-1 rounded-lg inline-block">
                                {spotsOpen} Spot{spotsOpen !== 1 ? 's' : ''} Left!
                              </div>
                            )}

                            {!isFull && spotsOpen > 2 && (
                              <div className="bg-mint-100 text-mint-700 text-xs font-semibold px-2 py-1 rounded-lg inline-block">
                                {spotsOpen} Open
                              </div>
                            )}

                            {isFull && (
                              <div className="bg-peach-200 text-peach-700 text-xs font-bold px-2 py-1 rounded-lg inline-block">
                                Full
                              </div>
                            )}
                          </div>

                          {/* Capacity Indicator */}
                          <CapacityIndicator filled={filledCount} capacity={slot.capacity} size="sm" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedSlotId && (
        <SlotDetailsModal slotId={selectedSlotId} onClose={() => setSelectedSlotId(null)} />
      )}
    </>
  );
}
