/**
 * Comprehensive data models for MyToolTrove tool information
 * Includes SEO, about, features, use cases, FAQ, and other sections
 */

// FAQ Section Models
export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  subtitle: string;
  accentColor: string;
  faqs: FAQ[];
}

// Feature Models
export interface Feature {
  icon?: string;
  iconPath?: string;
  title: string;
  description: string;
}

export interface FeaturesSection {
  label: string;
  title: string;
  subtitle: string;
  features: Feature[];
}

// Use Case Models
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

export interface UseCasesSection {
  title: string;
  description: string;
  label: string;
  useCases: UseCase[];
  modalData?: UseCaseModalData; // Optional modal data for additional info
}

// About Section Models
export interface VisualContent {
  type: string;
  svg?: string;
  src?: string;
  alt?: string;
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

// Theory Section Models (for Trading/Calculator tools)
export interface TheoryCard {
  icon: string;
  title: string;
  description: string;
}

export interface TheorySection {
  label: string;
  labelIcon: string;
  title: string;
  subtitle: string;
  cards: TheoryCard[];
}

// SEO Models
export interface SEOData {
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  h2: string;
  canonicalUrl: string;
}

// Complete Tool Data Model
export interface ToolData {
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
  seo: SEOData;
  aboutSection: AboutSection;
  featuresSection: FeaturesSection;
  useCasesSection: UseCasesSection;
  faqSection: FAQSection;
  theorySection?: TheorySection; // Optional, only for certain tools like GANN
}
export interface ToolSEO {
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  h2: string;
  canonicalUrl?: string;
  faqs?: FAQ[];
}