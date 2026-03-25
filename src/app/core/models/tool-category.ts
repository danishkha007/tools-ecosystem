import { Tool } from './tool';

export interface ToolCategory {
  name: string;
  order?: number;
  tools?: Tool[];
}
