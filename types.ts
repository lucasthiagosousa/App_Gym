
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'Homem' | 'Mulher' | 'Outro';
  goal?: 'Hipertrofia' | 'Emagrecimento' | 'Força';
  level?: 'Iniciante' | 'Intermediário' | 'Avançado';
  trainingFrequency?: number;
  achievements?: string[]; 
  personalRecords?: { [exerciseId: string]: number };
  recoveryLogs?: { [date: string]: number }; 
}

export interface HydrationLog {
  goal: number; // ml
  current: number; // ml
  lastUpdate: number;
}

export interface MacroLog {
  protein: { goal: number; current: number };
  carbs: { goal: number; current: number };
  fats: { goal: number; current: number };
}

export interface MuscleFatigue {
  chest: number; // 0-100%
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
  core: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  videoUrl: string;
  animationUrl: string;
  tips: {
    posture: string;
    contraction: string;
    breathing: string;
  };
  commonErrors: string[];
  advancedTips?: string[]; 
  biomechanics?: string;
}

export interface ExerciseLog {
  weight: string;
  sets: string;
  completed: boolean;
  duration?: number; // segundos da série
  timestamp?: number;
}

export interface DayFeedback {
  day: number;
  difficulty: number;
  energy: number;
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
  currentDayLogs?: { [day: number]: { [exerciseIndex: number]: ExerciseLog } };
}

export interface Measurements {
  date: string;
  weight: number;
  arm: number;
  waist: number;
  bf?: number;
}

export type View = 'home' | 'exercises' | 'ai' | 'progress' | 'deals' | 'protocol' | 'profile';
