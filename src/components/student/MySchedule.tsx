import { useState } from 'react';
import { Calendar, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduling } from '@/contexts/SchedulingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function MySchedule() {
  const { state, rescheduleRecurring } = useScheduling();
  const { toast } = useToast();
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  const recurringSlot = state.timeSlots.find(
    (slot) => slot.id === state.currentStudent.recurringSlot
  );

  const availableSlots = state.timeSlots.filter(
    (slot) => slot.students.length < slot.capacity && slot.id !== state.currentStudent.recurringSlot
  );

  const handleReschedule = (newSlotId: string, day: string, time: string) => {
    if (recurringSlot) {
      rescheduleRecurring(recurringSlot.id, newSlotId, state.currentStudent.name);
      toast({
        title: 'Recurring Lesson Rescheduled!',
        description: `Your new recurring time is ${day} at ${time}`,
      });
      setIsRescheduling(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-medium border-2 border-border overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-lavender-50 to-lavender-100/50 border-b-2 border-lavender-200">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lavender-200 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-lavender-700" />
          </div>
          <div>
            <p className="text-xl font-bold">My Active Plan</p>
            <p className="text-sm font-normal text-muted-foreground">Your recurring lesson schedule</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {recurringSlot ? (
          <>
            {/* Current Schedule */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-lavender-100/50 to-lavender-50/30 border-2 border-lavender-300 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-lavender-300 flex items-center justify-center shadow-lg">
                    <Clock className="h-7 w-7 text-lavender-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lavender-700 mb-1">Every {recurringSlot.day}</p>
                    <p className="text-3xl font-bold text-lavender-900">{recurringSlot.time}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsRescheduling(!isRescheduling)}
                  variant="outline"
                  className="rounded-xl font-semibold border-2 border-lavender-300 hover:bg-lavender-100"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRescheduling ? 'animate-spin' : ''}`} />
                  {isRescheduling ? 'Cancel' : 'Reschedule'}
                </Button>
              </div>
            </motion.div>

            {/* Reschedule Options */}
            <AnimatePresence>
              {isRescheduling && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-sm">Select New Recurring Time</p>
                    <span className="text-xs text-muted-foreground">({availableSlots.length} available)</span>
                  </div>

                  {availableSlots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No available slots at the moment</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                      {availableSlots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            onClick={() => handleReschedule(slot.id, slot.day, slot.time)}
                            className="cursor-pointer hover:border-lavender-300 transition-all border-2 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-mint-100 flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-mint-700" />
                                </div>
                                <div>
                                  <p className="font-bold text-lg">{slot.day}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {slot.time}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold text-mint-700 bg-mint-100 px-3 py-1 rounded-full">
                                  {slot.capacity - slot.students.length} spots open
                                </span>
                                <Button
                                  size="sm"
                                  className="rounded-xl mt-2 font-semibold"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Select
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-16 w-16 mx-auto mb-3 opacity-30" />
            <p className="font-medium">You don't have a recurring slot scheduled yet.</p>
            <p className="text-sm">Contact your instructor to set up a recurring lesson.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
