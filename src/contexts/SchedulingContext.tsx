import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type BookingType = 'recurring' | 'makeup' | 'intro';

export interface Student {
  id: string;
  name: string;
  bookingType: BookingType;
}

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  students: Student[];
  capacity: number;
}

interface SchedulingState {
  timeSlots: TimeSlot[];
  currentStudent: {
    id: string;
    name: string;
    recurringSlot: string | null;
  };
}

type Action =
  | { type: 'ADD_STUDENT'; slotId: string; student: Student }
  | { type: 'REMOVE_STUDENT'; slotId: string; studentId: string }
  | { type: 'BOOK_MAKEUP'; slotId: string; studentName: string };

const initialState: SchedulingState = {
  timeSlots: [
    // Monday
    {
      id: 'mon-3pm',
      day: 'Monday',
      time: '3:00 PM',
      students: [
        { id: 's1', name: 'Emma Wilson', bookingType: 'recurring' },
        { id: 's2', name: 'Liam Brown', bookingType: 'recurring' },
      ],
      capacity: 5,
    },
    {
      id: 'mon-4pm',
      day: 'Monday',
      time: '4:00 PM',
      students: [
        { id: 's3', name: 'Olivia Davis', bookingType: 'recurring' },
        { id: 's4', name: 'Noah Miller', bookingType: 'recurring' },
        { id: 's5', name: 'Ava Garcia', bookingType: 'intro' },
        { id: 's6', name: 'Ethan Martinez', bookingType: 'makeup' },
        { id: 's7', name: 'Sophia Rodriguez', bookingType: 'recurring' },
      ],
      capacity: 5,
    },
    {
      id: 'mon-5pm',
      day: 'Monday',
      time: '5:00 PM',
      students: [
        { id: 's8', name: 'Isabella Anderson', bookingType: 'recurring' },
        { id: 's9', name: 'Mason Thomas', bookingType: 'makeup' },
      ],
      capacity: 5,
    },
    // Tuesday
    {
      id: 'tue-4pm',
      day: 'Tuesday',
      time: '4:00 PM',
      students: [
        { id: 's10', name: 'Mia Jackson', bookingType: 'recurring' },
        { id: 's11', name: 'Lucas White', bookingType: 'recurring' },
        { id: 's12', name: 'Charlotte Harris', bookingType: 'intro' },
        { id: 's13', name: 'Elijah Martin', bookingType: 'recurring' },
      ],
      capacity: 5,
    },
    {
      id: 'tue-5pm',
      day: 'Tuesday',
      time: '5:00 PM',
      students: [
        { id: 's14', name: 'Amelia Thompson', bookingType: 'recurring' },
        { id: 's15', name: 'James Lee', bookingType: 'recurring' },
        { id: 's16', name: 'Harper Walker', bookingType: 'makeup' },
        { id: 's17', name: 'Benjamin Hall', bookingType: 'recurring' },
        { id: 's18', name: 'Evelyn Allen', bookingType: 'recurring' },
      ],
      capacity: 5,
    },
    // Wednesday
    {
      id: 'wed-3pm',
      day: 'Wednesday',
      time: '3:00 PM',
      students: [],
      capacity: 5,
    },
    {
      id: 'wed-4pm',
      day: 'Wednesday',
      time: '4:00 PM',
      students: [
        { id: 's19', name: 'Abigail Young', bookingType: 'recurring' },
      ],
      capacity: 5,
    },
    // Thursday
    {
      id: 'thu-4pm',
      day: 'Thursday',
      time: '4:00 PM',
      students: [
        { id: 's20', name: 'Alexander King', bookingType: 'recurring' },
        { id: 's21', name: 'Emily Wright', bookingType: 'intro' },
        { id: 's22', name: 'Michael Scott', bookingType: 'recurring' },
      ],
      capacity: 5,
    },
    {
      id: 'thu-5pm',
      day: 'Thursday',
      time: '5:00 PM',
      students: [
        { id: 's23', name: 'Elizabeth Lopez', bookingType: 'recurring' },
        { id: 's24', name: 'Daniel Hill', bookingType: 'makeup' },
      ],
      capacity: 5,
    },
    // Friday
    {
      id: 'fri-3pm',
      day: 'Friday',
      time: '3:00 PM',
      students: [
        { id: 's25', name: 'Sofia Green', bookingType: 'recurring' },
        { id: 's26', name: 'Matthew Adams', bookingType: 'recurring' },
        { id: 's27', name: 'Avery Baker', bookingType: 'makeup' },
      ],
      capacity: 5,
    },
  ],
  currentStudent: {
    id: 'current-student',
    name: 'Alex Thompson',
    recurringSlot: 'mon-3pm',
  },
};

function schedulingReducer(state: SchedulingState, action: Action): SchedulingState {
  switch (action.type) {
    case 'ADD_STUDENT': {
      return {
        ...state,
        timeSlots: state.timeSlots.map((slot) => {
          if (slot.id === action.slotId && slot.students.length < slot.capacity) {
            return {
              ...slot,
              students: [...slot.students, action.student],
            };
          }
          return slot;
        }),
      };
    }
    case 'REMOVE_STUDENT': {
      return {
        ...state,
        timeSlots: state.timeSlots.map((slot) => {
          if (slot.id === action.slotId) {
            return {
              ...slot,
              students: slot.students.filter((s) => s.id !== action.studentId),
            };
          }
          return slot;
        }),
      };
    }
    case 'BOOK_MAKEUP': {
      const newStudent: Student = {
        id: `makeup-${Date.now()}`,
        name: action.studentName,
        bookingType: 'makeup',
      };
      return {
        ...state,
        timeSlots: state.timeSlots.map((slot) => {
          if (slot.id === action.slotId && slot.students.length < slot.capacity) {
            return {
              ...slot,
              students: [...slot.students, newStudent],
            };
          }
          return slot;
        }),
      };
    }
    default:
      return state;
  }
}

interface SchedulingContextType {
  state: SchedulingState;
  addStudent: (slotId: string, student: Student) => void;
  removeStudent: (slotId: string, studentId: string) => void;
  bookMakeup: (slotId: string, studentName: string) => void;
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

export function SchedulingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(schedulingReducer, initialState);

  const addStudent = (slotId: string, student: Student) => {
    dispatch({ type: 'ADD_STUDENT', slotId, student });
  };

  const removeStudent = (slotId: string, studentId: string) => {
    dispatch({ type: 'REMOVE_STUDENT', slotId, studentId });
  };

  const bookMakeup = (slotId: string, studentName: string) => {
    dispatch({ type: 'BOOK_MAKEUP', slotId, studentName });
  };

  return (
    <SchedulingContext.Provider value={{ state, addStudent, removeStudent, bookMakeup }}>
      {children}
    </SchedulingContext.Provider>
  );
}

export function useScheduling() {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
}
