// export interface Tool {
//   id: string;
//   name: string;
//   shortDescription: string;
//   description?: string;
//   route: string;
//   icon?: string;
//   iconAlt?: string;
//   category: string;
//   longDescription?: string;
//   buttonText?: string;
//   tags?: string[];
//   seo?: ToolSEO;
//   aboutSection?: AboutSection;
//   featuresSection?: FeaturesSection;
//   useCasesSection?: UseCasesSection;
//   faqSection?: FAQSection;
// }

// export interface ToolSEO {
//   title: string;
//   metaDescription: string;
//   keywords: string[];
//   h1: string;
//   h2: string;
//   canonicalUrl?: string;
//   faqs?: FAQ[];
// }

// export interface FAQ {
//   question: string;
//   answer: string;
// }

// export interface AboutSection {
//   badgeText: string;
//   badgeIcon: string;
//   title: string;
//   description: string;
//   ctaPrimaryText: string;
//   ctaNote: string;
//   features: AboutFeature[];
//   visualContent: VisualContent;
// }

// export interface AboutFeature {
//   icon: string;
//   title: string;
//   description: string;
// }

// export interface VisualContent {
//   type: 'image' | 'svg-hexagon' | 'illustration';
//   src?: string;
//   alt?: string;
//   svg?: string;
// }

// export interface FeaturesSection {
//   label: string;
//   title: string;
//   subtitle: string;
//   features: Feature[];
// }

// export interface Feature {
//   iconPath: string;
//   title: string;
//   description: string;
// }

// export interface UseCasesSection {
//   title: string;
//   description: string;
//   label: string;
//   useCases: UseCase[];
// }

// export interface UseCase {
//   icon: string;
//   title: string;
//   description: string;
// }

// export interface FAQSection {
//   title: string;
//   accentColor: string;
//   faqs: FAQ[];
// }