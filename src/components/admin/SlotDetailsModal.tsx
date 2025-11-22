import { useState } from 'react';
import { X, Plus, Trash2, User } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface SlotDetailsModalProps {
  slotId: string;
  onClose: () => void;
}

export function SlotDetailsModal({ slotId, onClose }: SlotDetailsModalProps) {
  const { state, addStudent, removeStudent } = useScheduling();
  const [isAdding, setIsAdding] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [bookingType, setBookingType] = useState<BookingType>('recurring');

  const slot = state.timeSlots.find((s) => s.id === slotId);

  if (!slot) return null;

  const handleAddStudent = () => {
    if (newStudentName.trim() && slot.students.length < slot.capacity) {
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: newStudentName.trim(),
        bookingType,
      };
      addStudent(slotId, newStudent);
      setNewStudentName('');
      setIsAdding(false);
    }
  };

  const getBookingTypeColor = (type: BookingType) => {
    switch (type) {
      case 'recurring':
        return 'bg-soft-periwinkle text-soft-periwinkle-foreground';
      case 'makeup':
        return 'bg-pastel-coral text-pastel-coral-foreground';
      case 'intro':
        return 'bg-pale-sunshine text-pale-sunshine-foreground';
    }
  };

  const getBookingTypeLabel = (type: BookingType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {slot.day} at {slot.time}
          </DialogTitle>
          <DialogDescription>
            Capacity: {slot.students.length} / {slot.capacity} students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Student List */}
          <div className="space-y-2">
            {slot.students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No students in this slot</p>
              </div>
            ) : (
              slot.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full inline-block mt-1',
                          getBookingTypeColor(student.bookingType)
                        )}
                      >
                        {getBookingTypeLabel(student.bookingType)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStudent(slotId, student.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Add Student Form */}
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              disabled={slot.students.length >= slot.capacity}
              className="w-full rounded-xl"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          ) : (
            <div className="p-4 bg-secondary rounded-xl space-y-3 border border-border">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  placeholder="Enter student name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-type">Booking Type</Label>
                <Select value={bookingType} onValueChange={(v) => setBookingType(v as BookingType)}>
                  <SelectTrigger id="booking-type" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="makeup">Makeup</SelectItem>
                    <SelectItem value="intro">Intro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddStudent} className="flex-1 rounded-xl">
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewStudentName('');
                  }}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
