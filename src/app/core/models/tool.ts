export interface Tool {
  id: string;
  name: string;
  description: string;
  route: string;
  icon?: string;
  iconAlt?: string;
  category: string;
  longDescription?: string;
  buttonText?: string;
  seo?: ToolSEO;
}

export interface ToolSEO {
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  h2: string;
  faqs?: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}
