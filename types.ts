export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  techStack: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  targetJobTitle: string;
  summary: string;
  skills: string; // Comma separated for simplicity in UI, parsed for display
  photoUrl?: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

export type TemplateType = 'modern' | 'minimal' | 'futuristic';

export const INITIAL_RESUME_DATA: ResumeData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  targetJobTitle: '',
  summary: '',
  skills: '',
  photoUrl: '',
  experience: [],
  education: [],
  projects: []
};