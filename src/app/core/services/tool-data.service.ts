import { Injectable } from '@angular/core';
import { ToolData } from '../models/tool-data.model';
import toolSeoData from '../models/tool-seo-data.json';

@Injectable({
  providedIn: 'root'
})
export class ToolDataService {
  private tools: ToolData[] = toolSeoData.tools;

  /**
   * Get all available tools
   */
  getAllTools(): ToolData[] {
    return this.tools;
  }

  /**
   * Get a specific tool by its ID
   */
  getToolById(id: string): ToolData {
    return this.tools.find(tool => tool.id === id) as ToolData;
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
   * Get all unique categories
   */
  getCategories(): string[] {
    const categories = this.tools.map(tool => tool.category);
    return [...new Set(categories)];
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
      tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      tool.seo.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get SEO data for a specific tool
   */
  getToolSEOData(id: string): ToolData['seo'] | undefined {
    const tool = this.getToolById(id);
    return tool?.seo;
  }

  /**
   * Get about section data for a specific tool
   */
  getToolAboutSection(id: string): ToolData['aboutSection'] | undefined {
    const tool = this.getToolById(id);
    return tool?.aboutSection;
  }

  /**
   * Get features section data for a specific tool
   */
  getToolFeaturesSection(id: string): ToolData['featuresSection'] | undefined {
    const tool = this.getToolById(id);
    return tool?.featuresSection;
  }

  /**
   * Get use cases section data for a specific tool
   */
  getToolUseCasesSection(id: string): ToolData['useCasesSection'] | undefined {
    const tool = this.getToolById(id);
    return tool?.useCasesSection;
  }

  /**
   * Get FAQ section data for a specific tool
   */
  getToolFAQSection(id: string): ToolData['faqSection'] | undefined {
    const tool = this.getToolById(id);
    return tool?.faqSection;
  }

  /**
   * Get theory section data for a specific tool (if available)
   */
  getToolTheorySection(id: string): ToolData['theorySection'] | undefined {
    const tool = this.getToolById(id);
    return tool?.theorySection;
  }
}