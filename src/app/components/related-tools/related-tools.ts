import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tool } from '@core/models/tool-data.model';
import { DataService } from '@core/services/data.service';
import { ToolCardComponent } from '@components/tool-card/tool-card';

@Component({
  selector: 'app-related-tools',
  standalone: true,
  imports: [CommonModule, ToolCardComponent],
  templateUrl: './related-tools.html',
  styleUrl: './related-tools.scss'
})
export class RelatedToolsComponent implements OnChanges {
  @Input() currentTool?: Tool;
  @Input() limit = 4;

  tools: Tool[] = [];

  constructor(private dataService: DataService) {}

  ngOnChanges(): void {
    if (!this.currentTool) {
      this.tools = [];
      return;
    }

    this.tools = this.dataService.getRelatedTools(this.currentTool, this.limit);
  }

  getCategoryName(tool: Tool): string {
    return this.dataService.getCategoryNameById(tool.category);
  }
}
