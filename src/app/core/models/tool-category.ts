import { ToolData } from './tool-data.model';

export interface ToolCategory {
  name: string;
  order?: number;
  tools?: ToolData[];
}
