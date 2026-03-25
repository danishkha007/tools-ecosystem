export interface Resume {
  personal: {
    name: string;
    email: string;
    phone: string;
  };
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    description: string;
  }[];
  education: {
    institute: string;
    degree: string;
  }[];
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
}