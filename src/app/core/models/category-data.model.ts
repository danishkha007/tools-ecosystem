import { Tool } from "./tool-data.model";

export interface CategoryData {
    name: string;
    description: string;
    categories: {
        tools: Category[]
    }
}
export interface Category {
    id: string;
    name: string;
    route: string;
    order: number;
    description: string;
    icon?: string;
    tools?: Tool[];
}