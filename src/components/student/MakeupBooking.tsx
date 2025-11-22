import { useState } from 'react';
import { Search, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduling } from '@/contexts/SchedulingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function MakeupBooking() {
  const { state, bookMakeup } = useScheduling();
  const [showAvailable, setShowAvailable] = useState(false);
  const { toast } = useToast();

  const availableSlots = state.timeSlots.filter(
    (slot) => slot.students.length < slot.capacity
  );

  const handleBookMakeup = (slotId: string, day: string, time: string) => {
    bookMakeup(slotId, state.currentStudent.name);
    toast({
      title: 'Makeup Lesson Booked!',
      description: `Your makeup lesson is scheduled for ${day} at ${time}`,
    });
    setShowAvailable(false);
  };

  return (
    <Card className="rounded-2xl shadow-medium border-2 border-border overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-mint-50 to-mint-100/50 border-b-2 border-mint-200">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mint-200 flex items-center justify-center">
            <Search className="h-5 w-5 text-mint-700" />
          </div>
          <div>
            <p className="text-xl font-bold">Book a Makeup Lesson</p>
            <p className="text-sm font-normal text-muted-foreground">Make up for a missed class</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <AnimatePresence mode="wait">
          {!showAvailable ? (
            <motion.div
              key="search-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                onClick={() => setShowAvailable(true)}
                className="w-full rounded-xl h-14 font-bold text-base bg-gradient-to-r from-mint-200 to-mint-300 hover:from-mint-300 hover:to-mint-400 text-mint-900 border-2 border-mint-400"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Find Available Slots
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="slot-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
                  <p className="text-sm font-bold">
                    {availableSlots.length} slots available
                  </p>
                </div>
                <Button
                  onClick={() => setShowAvailable(false)}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl font-semibold"
                >
                  Close
                </Button>
              </div>

              {availableSlots.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No available slots at the moment</p>
                  <p className="text-sm">Check back later for openings</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {availableSlots.map((slot, index) => {
                    const spotsOpen = slot.capacity - slot.students.length;
                    const isAlmostFull = spotsOpen <= 2;
                    
                    return (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all border-2 p-4 ${
                            isAlmostFull 
                              ? 'border-peach-300 bg-gradient-to-br from-peach-50 to-transparent hover:border-peach-400' 
                              : 'border-mint-200 bg-gradient-to-br from-mint-50/50 to-transparent hover:border-mint-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isAlmostFull ? 'bg-peach-200' : 'bg-mint-200'
                              }`}>
                                <Calendar className={`h-6 w-6 ${
                                  isAlmostFull ? 'text-peach-700' : 'text-mint-700'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg">{slot.day}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {slot.time}
                                </div>
                                {isAlmostFull && (
                                  <div className="mt-2 inline-flex items-center gap-1 bg-peach-200 text-peach-700 text-xs font-bold px-2 py-1 rounded-full">
                                    <Sparkles className="h-3 w-3" />
                                    Only {spotsOpen} left!
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                isAlmostFull 
                                  ? 'bg-peach-200 text-peach-700' 
                                  : 'bg-mint-200 text-mint-700'
                              }`}>
                                {spotsOpen}/{slot.capacity} open
                              </span>
                              <Button
                                onClick={() => handleBookMakeup(slot.id, slot.day, slot.time)}
                                size="sm"
                                className="rounded-xl font-semibold"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
