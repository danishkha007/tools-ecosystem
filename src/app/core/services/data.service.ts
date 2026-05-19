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

    getOtherToolsInCategory(currentTool: Tool, limit = 4): Tool[] {
        return this.getToolsByCategory(currentTool.category)
            .filter(tool => tool.id !== currentTool.id)
            .slice(0, limit);
    }

    getRelatedTools(currentTool: Tool, limit = 4): Tool[] {
        const currentTags = new Set(currentTool.tags.map(tag => tag.toLowerCase()));

        const scoredTools = this.toolData.tools
            .filter(tool => tool.id !== currentTool.id)
            .map(tool => ({
                tool,
                score: this.getToolRelatedScore(currentTool, tool, currentTags)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));

        const crossCategoryTools = scoredTools
            .filter(item => item.tool.category !== currentTool.category)
            .map(item => item.tool);

        const relatedTools = crossCategoryTools.length > 0
            ? crossCategoryTools
            : scoredTools.map(item => item.tool);

        return relatedTools.slice(0, limit);
    }

    private getToolRelatedScore(currentTool: Tool, candidateTool: Tool, currentTags: Set<string>): number {
        const sharedTagScore = candidateTool.tags
            .filter(tag => currentTags.has(tag.toLowerCase()))
            .length * 3;
        const categoryScore = candidateTool.category === currentTool.category ? 2 : 0;
        const textScore = this.getSharedSearchTermScore(currentTool, candidateTool);

        return sharedTagScore + categoryScore + textScore;
    }

    private getSharedSearchTermScore(currentTool: Tool, candidateTool: Tool): number {
        const currentTerms = this.getSearchTerms(currentTool);
        const candidateTerms = this.getSearchTerms(candidateTool);

        return [...currentTerms].filter(term => candidateTerms.has(term)).length;
    }

    private getSearchTerms(tool: Tool): Set<string> {
        const ignoredTerms = new Set([
            'tool',
            'tools',
            'free',
            'online',
            'browser',
            'based',
            'secured',
            'data',
            'with',
            'your',
            'from',
            'into',
            'file',
            'files'
        ]);
        const searchableText = `${tool.name} ${tool.shortDescription} ${tool.tags.join(' ')}`;
        const terms = searchableText
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(term => term.length > 2 && !ignoredTerms.has(term));

        return new Set(terms);
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

    getCategoryNameById(id: string): string {
        const category = this.categoryData.categories.tools.find(category => category.id === id);
        return category ? category.name : '';
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
