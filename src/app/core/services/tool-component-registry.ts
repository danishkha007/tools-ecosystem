import { Route, Routes } from '@angular/router';
import { Type } from '@angular/core';
import { Tool } from '../models/tool-data.model';

type ToolComponentLoader = NonNullable<Route['loadComponent']>;
type MainToolComponentLoader = () => Promise<Type<unknown>>;

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

const toolPageTemplateLoader: ToolComponentLoader = () =>
  import('../../components/tool-page-template/tool-page-template').then(m => m.ToolPageTemplateComponent);

// function routePath(toolRoute: string): string {
//   return toolRoute.replace(/^\/+/, '');
// }

export function loadToolComponentById(toolId: string): Promise<Type<unknown>> {
  const loadComponent = toolComponentLoaders[toolId];

  if (!loadComponent) {
    throw new Error(`No component registered for tool id "${toolId}"`);
  }

  return loadComponent();
}

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
