import { Route, Routes } from '@angular/router';
import { Type } from '@angular/core';
import { Tool } from '../models/tool-data.model';
import TOOL_CATEGORIES from '@core/data/category-data.json';

type ToolComponentLoader = NonNullable<Route['loadComponent']>;
type MainToolComponentLoader = () => Promise<Type<unknown>>;

export function buildToolRoutes(tools: Tool[]): Routes {
    return tools.map(tool => {
        const loadComponent = toolComponentLoaders[tool.id];

        if (!loadComponent) {
            throw new Error(`No component registered for tool id "${tool.id}"`);
        }

        return {
            path: tool.route,
            data: { toolId: tool.id },
            loadComponent: toolPageTemplateLoader,
        };
    });
}
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

const toolPageTemplateLoader: ToolComponentLoader = () =>
    import('../../pages/tool/tool').then(m => m.ToolPageComponent);

export function loadToolComponentById(toolId: string): Promise<Type<unknown>> {
    const loadComponent = toolComponentLoaders[toolId];

    if (!loadComponent) {
        throw new Error(`No component registered for tool id "${toolId}"`);
    }

    return loadComponent();
}




const categoryPageLoader = (() => import('../../pages/category/category').then(m => m.CategoryPageComponent));
const toolComponentLoaders: Record<string, MainToolComponentLoader> = {
    'gann-hexagonal-sr-calculator': () =>
        import('../../features/calculators/gann/hexagonal-support-resistance/hexagonal-sr-calculator').then(m => m.GannCalculator),
    'resume-builder': () =>
        import('../../features/resume-builder/resume-builder').then(m => m.ResumeBuilder),
    'pdf-compressor': () =>
        import('../../features/pdf-compress/pdf-compress').then(m => m.PdfCompressorComponent),
    'pdf-merger': () =>
        import('../../features/pdf-merge/pdf-merge').then(m => m.PdfMergeComponent),
    'image-compressor': () =>
        import('../../features/image-compressor/image-compressor').then(m => m.ImageCompressor),
    'json-formatter': () =>
        import('../../features/json-formatter/json-formatter').then(m => m.JsonFormatterComponent),
    'qr-code-generator': () =>
        import('../../features/qr-code-generator/qr-code-generator').then(m => m.QrCodeGeneratorComponent),
};