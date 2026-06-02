import { Injectable } from "@angular/core";
import { AppData, Data } from "@core/models/app-data.model";
import { Tool, ToolData } from "@core/models/tool-data.model";
import { Category, CategoryData } from "@core/models/category-data.model";
import { SeoData } from "@core/models/seo-data.model";
import appData from '../data/app-data.json';
import toolData from '../data/tool-data.json';
import categoryData from '../data/category-data.json';
import seoData from "@core/data/seo-data.json";
import { Post, PostData } from "../models/post-data";
import postData from '../data/post-data.json';

export const TOOL_DATA = toolData;
export const POST_DATA = postData;

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly toolCategories: Category[];
    private appData: AppData = appData;
    private toolData: ToolData = TOOL_DATA;
    private categoryData: CategoryData = categoryData;
    private seoData: SeoData = seoData;
    private postData: PostData = postData;
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
    
    getPostDataById(postId: string): Post {
        const post = this.postData.posts.find(post => post.id === postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return post;
    }

    getAllPosts(): Post[] {
        return this.postData.posts;
    }

    getRecommendedPosts(currentPost: Post, limit = 4): Post[] {
        const explicitPosts = this.getPostsByIds(currentPost.recommendedPostIds || []);
        const explicitPostIds = new Set(explicitPosts.map(post => post.id));

        const scoredPosts = this.postData.posts
            .filter(post => post.id !== currentPost.id && !explicitPostIds.has(post.id))
            .map(post => ({
                post,
                score: this.getPostRelatedScore(currentPost, post)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || a.post.name.localeCompare(b.post.name))
            .map(item => item.post);

        return [...explicitPosts, ...scoredPosts].slice(0, limit);
    }

    getRecommendedToolsForPost(post: Post, limit = 4): Tool[] {
        const explicitTools = this.getToolsByIds(post.recommendedToolIds || []);
        const explicitToolIds = new Set(explicitTools.map(tool => tool.id));

        const scoredTools = this.toolData.tools
            .filter(tool => !explicitToolIds.has(tool.id))
            .map(tool => ({
                tool,
                score: this.getPostToolRelatedScore(post, tool)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
            .map(item => item.tool);

        return [...explicitTools, ...scoredTools].slice(0, limit);
    }

    getData(): Data {
        return this.data;
    }


    getSeoDataById(id: string) {
        const allSeoItems = [...this.seoData.app, ...this.seoData.tools, ...this.seoData.categories, ...this.seoData.posts];
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

    private getToolsByIds(toolIds: string[]): Tool[] {
        return toolIds
            .map(toolId => this.getToolDataById(toolId))
            .filter((tool): tool is Tool => Boolean(tool));
    }

    private getPostsByIds(postIds: string[]): Post[] {
        return postIds
            .map(postId => this.postData.posts.find(post => post.id === postId))
            .filter((post): post is Post => Boolean(post));
    }

    private getPostRelatedScore(currentPost: Post, candidatePost: Post): number {
        const currentTags = new Set(currentPost.tags.map(tag => tag.toLowerCase()));
        const sharedTagScore = candidatePost.tags
            .filter(tag => currentTags.has(tag.toLowerCase()))
            .length * 3;
        const categoryScore = candidatePost.category === currentPost.category ? 2 : 0;
        const typeScore = candidatePost.type === currentPost.type ? 2 : 0;
        const textScore = this.getSharedPostTermScore(currentPost, candidatePost);

        return sharedTagScore + categoryScore + typeScore + textScore;
    }

    private getPostToolRelatedScore(post: Post, tool: Tool): number {
        const postTerms = this.getPostSearchTerms(post);
        const toolTerms = this.getSearchTerms(tool);
        const category = this.getCategoryDataById(tool.category);
        const categoryTerms = this.getTextTerms(`${tool.category} ${category?.name || ''} ${category?.description || ''}`);
        const sharedTermScore = [...postTerms].filter(term => toolTerms.has(term) || categoryTerms.has(term)).length;
        const tagScore = tool.tags
            .filter(tag => post.tags.some(postTag => this.normalizeTerm(postTag) === this.normalizeTerm(tag)))
            .length * 3;
        const categoryScore = post.category === tool.category || post.type === tool.category ? 3 : 0;

        return sharedTermScore + tagScore + categoryScore;
    }

    private getSharedPostTermScore(currentPost: Post, candidatePost: Post): number {
        const currentTerms = this.getPostSearchTerms(currentPost);
        const candidateTerms = this.getPostSearchTerms(candidatePost);

        return [...currentTerms].filter(term => candidateTerms.has(term)).length;
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
        return this.getTextTerms(`${tool.name} ${tool.shortDescription} ${tool.longDescription} ${tool.tags.join(' ')}`);
    }

    private getPostSearchTerms(post: Post): Set<string> {
        return this.getTextTerms(`${post.name} ${post.category} ${post.type} ${post.shortDescription} ${post.description} ${post.tags.join(' ')}`);
    }

    private getTextTerms(searchableText: string): Set<string> {
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
        const terms = searchableText
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(term => term.length > 2 && !ignoredTerms.has(term));

        return new Set(terms);
    }

    private normalizeTerm(term: string): string {
        return term.toLowerCase().replace(/[^a-z0-9]+/g, '');
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
