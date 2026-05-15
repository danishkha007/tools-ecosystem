import { Injectable } from "@angular/core";
import { AppData, Data } from "@core/models/app-data.model";
import { Tool, ToolData } from "@core/models/tool-data.model";
import { Category, CategoryData } from "@core/models/category-data.model";
import { SeoData } from "@core/models/seo-data.model";
import appData from '../data/app-data.json';
import toolData from '../data/tool-data.json';
import categoryData from '../data/category-data.json';
import seoData from "@core/data/seo-data.json";

export const TOOL_DATA = toolData;

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly toolCategories: Category[];
    private appData: AppData = appData;
    private toolData: ToolData = TOOL_DATA;
    private categoryData: CategoryData = categoryData;
    private seoData: SeoData = seoData;
    private data: Data;

    constructor() {
        this.data =  this.buildData();
        this.toolCategories = this.categoryData.categories.tools;
    }

    buildData(): Data {
        return {
            appData: this.appData,
            toolData: this.toolData,
            categoryData: this.categoryData,
            seoData: this.seoData
        };
    }

    getData(): Data {
        return this.data;
    }


    getSeoDataById(id: string) {
        const allSeoItems = [...this.seoData.app, ...this.seoData.tools, ...this.seoData.categories];
        return allSeoItems.find(seo => seo.id === id);
    }

    getCategoryDataById(id: string): Category {
        return this.categoryData.categories.tools.find(category => category.id === id) as Category;
    }

    getToolDataById(id: string) {
        return this.toolData.tools.find(tool => tool.id === id);
    }

    getCompleteToolDataById(id: string) {
        const toolData = this.toolData.tools.find(tool => tool.id === id) as Tool;
        toolData.seoData = this.getSeoDataById(id);
        return toolData;
    }

    getAppData(): AppData {
        return this.appData;
    }

    getAllTools(): Tool[] {
        return this.toolData.tools;
    }

    getToolCategories(): Category[] {
        return this.categoryData.categories.tools;
    }

    getSeoData(): SeoData {
        return this.seoData;
    }

    getToolsByCategory(category: string): Tool[] {
        return this.toolData.tools.filter(tool => tool.category === category);
    }

    getActiveToolCategories(): Category[] {
        const activeCategories = new Set(this.toolData.tools.map(tool => tool.category));
        return Array.from(activeCategories).map(category => this.getCategoryDataById(category));
    }

    getCategoriesWithTools(): Category[] {
        const tools = this.getAllTools();
        const activeCategoryNames = this.getActiveToolCategories().map(cat => cat.name);

        return this.toolCategories
            .filter(cat => activeCategoryNames.includes(cat.name))
            .map(category => ({
                ...category,
                tools: tools.filter(tool => tool.category === category.id)
            }));
    }

    // searchTools(query: string): Tool[] {
    //     const lowerQuery = query.toLowerCase();
    //     return this.toolData.tools.filter(tool =>
    //         tool.name.toLowerCase().includes(lowerQuery) ||
    //         tool.shortDescription.toLowerCase().includes(lowerQuery) ||
    //         tool.longDescription.toLowerCase().includes(lowerQuery) ||
    //         tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    //         tool.seoData?.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    //     );
    // }

    getNameById(id: string) {
        const tool = this.toolData.tools.find(tool => tool.id === id);
        if (tool) {
            return tool.name;
        }
        const category = this.categoryData.categories.tools.find(category => category.id === id);
        if (category) {
            return category.name;
        }
        return '';
        // return this.toolData.tools.find(tool => tool.id === id)?.name;
    }
}