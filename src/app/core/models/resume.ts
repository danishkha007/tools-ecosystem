export interface Resume {
  personal: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
    location?: string;
    jobTitle?: string;
  };
  summary: string;
  skills: string[];
  coreCompetencies?: string;
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    isCurrentJob: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    institute: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
    achievements?: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  languages?: {
    language: string;
    proficiency: string;
  }[];
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
}