export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  skills: string[];
  coreCompetencies?: string[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: Language[];
  style: Style;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
  location?: string;
  jobTitle?: string;
};

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  institute: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  achievements?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}
export interface Language {
  language: string;
  proficiency: string;
}

export interface Style {
  fontFamily: string;
  fontSize: number;
  color: string;
}