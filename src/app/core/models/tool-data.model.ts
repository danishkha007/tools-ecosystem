import { Seo } from "./seo-data.model";

export interface ToolData {
  name: string;
  description: string;
  tools: Tool[];
}

export interface Tool {
  id: string;
  name: string;
  route: string;
  category: string;
  icon: string;
  iconAlt?: string;
  shortDescription: string;
  longDescription: string;
  buttonText: string;
  tags: string[];
  seoData?: Seo;
  aboutSection?: AboutSection;
  featuresSection?: FeaturesSection;
  useCasesSection?: UseCasesSection;
  faqSection?: FAQSection;
  theorySection?: TheorySection;
  instructionsSection?: InstructionalSection;
  comparisonSection?: ComparisonSection;
  technicalNoteSection?: TechnicalNoteSection;
}

export interface InstructionalSection {
  title: string;
  badgeText: string;
  description: string;
  steps: Step[];
}

export interface Step {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface ComparisonSection {
  title: string;
  subtitle: string;
  columns: string[];
  rows: ComparisonRow[];
}

export interface ComparisonRow {
  feature: string;
  description?: string; // Optional description for the feature
  values: Array<string | string[]>;
}

export interface TechnicalNoteSection {
  title: string;
  description: string;
  techStack: string[];
}

export interface AboutSection {
  badgeText: string;
  badgeIcon: string;
  title: string;
  description: string;
  ctaPrimaryText: string;
  ctaNote: string;
  features: Feature[];
  visualContent: VisualContent;
}

export interface FeaturesSection {
  label: string;
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface UseCasesSection {
  title: string;
  description: string;
  label: string;
  useCases: UseCase[];
  modalData?: UseCaseModalData; // Optional modal data for additional info
}
export interface FAQSection {
  title: string;
  subtitle: string;
  accentColor: string;
  faqs: FAQ[];
}

export interface TheorySection {
  label: string;
  labelIcon: string;
  title: string;
  subtitle: string;
  cards: TheoryCard[];
}

export interface Feature {
  icon?: string;
  iconPath?: string;
  title: string;
  description: string;
}

export interface VisualContent {
  type: string;
  svg?: string;
  src?: string;
  alt?: string;
}

export interface UseCase {
  icon: string;
  iconColor?: string; // Color for the icon
  title: string;
  description: string;
  link?: string; // Optional link for navigation
  linkText?: string; // Optional custom text for link
  benefits?: string[]; // Benefits shown in modal
  color?: string; // Background color for modal
}

export interface UseCaseModalData {
  title: string;
  description: string;
  benefits?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface TheoryCard {
  icon: string;
  title: string;
  description: string;
}