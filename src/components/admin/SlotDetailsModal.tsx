import { useState } from 'react';
import { X, Plus, Trash2, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduling, BookingType, Student } from '@/contexts/SchedulingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingTypeBadge } from '@/components/BookingTypeBadge';
import { CapacityIndicator } from '@/components/CapacityIndicator';
import { useToast } from '@/hooks/use-toast';

interface SlotDetailsModalProps {
  slotId: string;
  onClose: () => void;
}

export function SlotDetailsModal({ slotId, onClose }: SlotDetailsModalProps) {
  const { state, addStudent, removeStudent } = useScheduling();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [bookingType, setBookingType] = useState<BookingType>('recurring');

  const slot = state.timeSlots.find((s) => s.id === slotId);

  if (!slot) return null;

  const spotsOpen = slot.capacity - slot.students.length;
  const isFull = spotsOpen === 0;

  const handleAddStudent = () => {
    if (newStudentName.trim() && slot.students.length < slot.capacity) {
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: newStudentName.trim(),
        bookingType,
      };
      addStudent(slotId, newStudent);
      toast({
        title: 'Student Added',
        description: `${newStudentName} has been added to ${slot.day} at ${slot.time}`,
      });
      setNewStudentName('');
      setIsAdding(false);
    }
  };

  const handleQuickBook = (type: BookingType) => {
    const dummyNames = {
      intro: ['New Student', 'Trial Lesson', 'Intro Student'],
      makeup: ['Makeup Lesson', 'Rescheduled Student', 'Makeup Student'],
      recurring: ['New Recurring', 'Regular Student'],
    };
    
    const randomName = dummyNames[type][Math.floor(Math.random() * dummyNames[type].length)];
    const newStudent: Student = {
      id: `quick-${Date.now()}`,
      name: `${randomName} ${Math.floor(Math.random() * 100)}`,
      bookingType: type,
    };
    
    addStudent(slotId, newStudent);
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Booked`,
      description: `Quick-booked a ${type} lesson`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {slot.day} at {slot.time}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className={isFull ? 'text-peach-700 font-semibold' : ''}>
              {spotsOpen} {spotsOpen === 1 ? 'spot' : 'spots'} available
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Capacity Indicator */}
          <CapacityIndicator filled={slot.students.length} capacity={slot.capacity} size="lg" />

          {/* Quick Actions - Only show if not full */}
          {!isFull && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-lavender-50 to-mint-50 p-4 rounded-xl border-2 border-lavender-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-lavender-700" />
                <p className="text-sm font-semibold text-lavender-700">Quick Book</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleQuickBook('intro')}
                  variant="outline"
                  size="sm"
                  className="bg-peach-100 border-peach-200 hover:bg-peach-200 text-peach-700 font-semibold"
                >
                  Intro Lesson
                </Button>
                <Button
                  onClick={() => handleQuickBook('makeup')}
                  variant="outline"
                  size="sm"
                  className="bg-mint-100 border-mint-200 hover:bg-mint-200 text-mint-700 font-semibold"
                >
                  Makeup
                </Button>
                <Button
                  onClick={() => handleQuickBook('recurring')}
                  variant="outline"
                  size="sm"
                  className="bg-lavender-100 border-lavender-200 hover:bg-lavender-200 text-lavender-700 font-semibold"
                >
                  Recurring
                </Button>
              </div>
            </motion.div>
          )}

          {/* Student List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {slot.students.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-16 w-16 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No students in this slot</p>
                <p className="text-sm">Use Quick Book or Add Student below</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {slot.students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-card rounded-xl border-2 border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{student.name}</p>
                        <BookingTypeBadge type={student.bookingType} className="mt-1" />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeStudent(slotId, student.id);
                        toast({
                          title: 'Student Removed',
                          description: `${student.name} has been removed from this slot`,
                        });
                      }}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Add Student Form */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              disabled={isFull}
              className="w-full rounded-xl h-12 font-semibold"
              variant="outline"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Custom Student
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 bg-secondary rounded-xl space-y-4 border-2 border-border"
            >
              <div className="space-y-2">
                <Label htmlFor="student-name" className="font-semibold">Student Name</Label>
                <Input
                  id="student-name"
                  placeholder="Enter student name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="rounded-xl h-11"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-type" className="font-semibold">Booking Type</Label>
                <Select value={bookingType} onValueChange={(v) => setBookingType(v as BookingType)}>
                  <SelectTrigger id="booking-type" className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="makeup">Makeup</SelectItem>
                    <SelectItem value="intro">Intro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddStudent} className="flex-1 rounded-xl h-11 font-semibold">
                  Add Student
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewStudentName('');
                  }}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
