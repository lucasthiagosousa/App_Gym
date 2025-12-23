
export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  videoUrl: string;
  animationUrl: string;
  tips: string[];
}

export interface ExerciseLog {
  weight: string;
  sets: string;
  completed: boolean;
}

export interface DayFeedback {
  day: number;
  difficulty: number; // 1-5
  energy: number; // 1-5
  notes: string;
  exerciseLogs?: { [exerciseName: string]: ExerciseLog };
}

export interface ActiveProtocol {
  title: string;
  objective: string;
  startDate: string;
  content: string; 
  completedDays: number[]; 
  initialMeasurements?: Measurements;
  feedbacks?: DayFeedback[];
  workoutSchedule?: { [key: number]: string[] };
  currentDayLogs?: { [day: number]: { [exerciseIndex: number]: ExerciseLog } };
}

export interface Measurements {
  date: string;
  weight: number;
  arm: number;
  waist: number;
  bf?: number;
}

export interface WorkoutLog {
  date: string;
  exercises: {
    exerciseId: string;
    sets: { weight: number; reps: number }[];
  }[];
}

export interface SupplementDeal {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
  link: string;
}

export interface ProgressData {
  date: string;
  weight: number;
  muscleMass?: number;
}

export type View = 'home' | 'exercises' | 'ai' | 'progress' | 'deals' | 'protocol';
