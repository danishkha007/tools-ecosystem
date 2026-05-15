import { Category, CategoryData } from "./category-data.model";
import { SeoData } from "./seo-data.model";
import { ToolData } from "./tool-data.model";

export interface Data {
    appData: AppData;
    toolData: ToolData;
    categoryData: CategoryData;
    seoData: SeoData;
}
export interface AppData {
    name: string;
    shortName: string;
    description: string;
    domain: string;
    logo: string;
    url: string;
    supportEmail?: string;
    socialLinks: SocialLinks;
    seo?: SeoData;
    categories?: Category;
    tools?: ToolData[];
}

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    facebook?: string;
}