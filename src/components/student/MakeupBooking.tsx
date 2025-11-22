import { useState } from 'react';
import { Search, CheckCircle2, Calendar, Clock } from 'lucide-react';
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
    <Card className="rounded-2xl shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-pastel-mint-foreground" />
          Book a Makeup Lesson
        </CardTitle>
        <CardDescription>
          Find an available time slot to make up a missed lesson
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showAvailable ? (
          <Button
            onClick={() => setShowAvailable(true)}
            className="w-full rounded-xl"
            variant="outline"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Available Slots
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">
                {availableSlots.length} slots available
              </p>
              <Button
                onClick={() => setShowAvailable(false)}
                variant="ghost"
                size="sm"
                className="rounded-xl"
              >
                Close
              </Button>
            </div>

            {availableSlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No available slots at the moment</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-pastel-mint/20 border-2 border-pastel-mint rounded-xl hover:bg-pastel-mint/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-pastel-mint-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{slot.day}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-pastel-mint-foreground">
                        {slot.students.length}/{slot.capacity} filled
                      </span>
                      <Button
                        onClick={() => handleBookMakeup(slot.id, slot.day, slot.time)}
                        size="sm"
                        className="rounded-xl"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Book
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
