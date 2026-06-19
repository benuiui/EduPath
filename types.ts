export interface Course {
  code: string;
  name: string;
  sks: number;
  category: "Wajib" | "Pilihan";
  description: string;
  prerequisite: string;
}

export interface RecommendedCourse {
  code: string;
  name: string;
  sks: number;
  category: string;
  alignment: string;
  description: string;
  prerequisite?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StudentProfile {
  name: string;
  major: string;
  year: string;
  currentGpa: number;
  completedSks: number;
  totalSksRequired: number;
  semesterBerjalan: number;
  semesterTotal: number;
}

export interface KrsPlan {
  id: string;
  name: string;
  status: "AKTIFF" | "Draf";
  lastUpdated: string;
  sks: number;
  courses: RecommendedCourse[];
  focusMinat: string;
}
