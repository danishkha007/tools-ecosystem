import { Route, Routes } from '@angular/router';
import { Tool } from '../models/tool-data.model';
import TOOL_CATEGORIES from '@core/data/category-data.json';

const categoryPageLoader: NonNullable<Route['loadComponent']> = () =>
  import('../../features/tool-category/tool-category').then(m => m.ToolCategoryPageComponent);

export function buildCategoryRoutes(tools: Tool[]): Routes {
  const activeCategoriesIds = tools.map(tool => tool.category);

  return TOOL_CATEGORIES.categories.tools
    .filter(category => activeCategoriesIds.includes(category.id))
    .map(category => ({
      path: `${category.route}`,
      data: { categoryName: category.name },
      loadComponent: categoryPageLoader,
    }));
}