import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tool } from '../../core/models/tool-data.model';
import { DataService } from '@core/services/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  popularTools: Tool[];
  tradingTools: Tool[];

  private readonly popularToolIds = ['resume-builder', 'pdf-merger', 'pdf-compressor', 'image-compressor'];

  constructor(private dataService: DataService) {
    const tools = this.dataService.getAllTools();
    this.popularTools = this.popularToolIds
      .map(id => tools.find(tool => tool.id === id))
      .filter((tool): tool is Tool => Boolean(tool));
    this.tradingTools = this.dataService.getToolsByCategory('trading-tools');
  }
}
