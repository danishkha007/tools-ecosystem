import { Injectable } from '@angular/core';
import { ToolCategory } from '../models/tool-category';
import { ToolData } from '../models/tool-data.model';
import toolSeoData from '../models/tool-seo-data.json';

@Injectable({
  providedIn: 'root'
})
export class ToolConfigService {
  // Use the complete tool data from JSON
  private readonly tools: ToolData[] = toolSeoData.tools;

  // Separate categories list
  private readonly categories: ToolCategory[] = [
    { name: 'Trading Tools', order: 1 },
    { name: 'Career Tools', order: 2 },
    { name: 'PDF Tools', order: 3 },
    { name: 'Image Tools', order: 4 },
    { name: 'Calculator Tools', order: 5 },
    { name: 'Developer Tools', order: 6 },
    { name: 'Utility Tools', order: 7 },
    { name: 'Other Tools', order: 8 },
  ];

  /**
   * Get all available tools
   */
  getAllTools(): ToolData[] {
    return this.tools;
  }

  /**
   * Get a specific tool by its ID
   */
  getToolById(id: string): ToolData | undefined {
    return this.tools.find(tool => tool.id === id);
  }

  /**
   * Get a specific tool by its route
   */
  getToolByRoute(route: string): ToolData | undefined {
    return this.tools.find(tool => tool.route === route);
  }

  /**
   * Get tools filtered by category
   */
  getToolsByCategory(category: string): ToolData[] {
    return this.tools.filter(tool => tool.category === category);
  }

  /**
   * Get all unique categories that have tools
   * Returns categories with tools populated in ToolCategory model format
   */
  getActiveCategories(): ToolCategory[] {
    const activeCategoryNames = [...new Set(this.tools.map(tool => tool.category))];
    return this.categories
      .filter(cat => activeCategoryNames.includes(cat.name))
      .map(category => ({
        ...category,
        tools: this.tools.filter(tool => tool.category === category.name)
      }));
  }

  /**
   * Get all categories (including empty ones)
   */
  getAllCategories(): ToolCategory[] {
    return this.categories;
  }

  /**
   * Search tools by keyword
   */
  searchTools(query: string): ToolData[] {
    const lowerQuery = query.toLowerCase();
    return this.tools.filter(tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.shortDescription.toLowerCase().includes(lowerQuery) ||
      tool.longDescription.toLowerCase().includes(lowerQuery) ||
      tool.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)) ||
      tool.seo.keywords.some((keyword: string) => keyword.toLowerCase().includes(lowerQuery))
    );
  }
}