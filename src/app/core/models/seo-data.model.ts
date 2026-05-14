export interface SeoData {
    name: string;
    description: string;
    app: Seo[];
    tools: Seo[];
    categories: Seo[];
}

export interface Seo {
    id: string;
    title: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    h1: string;
    h2: string;
}