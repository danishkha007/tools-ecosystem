import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '@core/services/seo.service';
import { ToolDataService } from '@core/services/tool-data.service';
import { ToolData } from '@core/models/tool-data.model';
import { SeoContentComponent } from '../../../../components/seo-content/seo-content';
import { ToolHeaderComponent } from '../../../../components/tool-header/tool-header';
interface GannLevel {
  level: number;
  type: 'resistance' | 'support';
  percentage: number;
}

interface TableRow { 
  degree: string; 
  support: number | null; 
  resistance: number | null 
}

interface HexagonRing {
  levels: GannLevel[];
}

@Component({
  selector: 'app-gann-hexagonal-sr-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent, SeoContentComponent],
  templateUrl: './hexagonal-sr-calculator.html',
  styleUrl: './hexagonal-sr-calculator.scss',
})
export class GannCalculator implements OnInit {

  toolId = 'gann-hexagonal-sr-calculator';

  inputValue: number | null = null;
  toolData: ToolData = {} as ToolData;  
  levels: GannLevel[] = [];
  tableRows: TableRow[] = [];
  hexagonRings: HexagonRing[] = [];
  showResults = false;
  gannValues : number[] = [0.29166, 0.583333, 0.875, 1.1666, 1.458333, 1.75];

  private toolDataService = inject(ToolDataService);
  private seoService = inject(SeoService);
  constructor() {
    const tool = this.toolDataService.getToolById(this.toolId);
    if (tool) {
      this.toolData = tool;
    }
  }

  ngOnInit(): void {
    this.seoService.setSeoData(this.toolData.seo);
  }

  calculate() {
    if (!this.inputValue || this.inputValue <= 0) {
      this.levels = [];
      this.showResults = false;
      return;
    }

    this.levels = [];
    const basePrice = this.inputValue;
    const sqInput = Math.sqrt(basePrice);

    // Add the base price as current level
    this.levels.push({
      level: basePrice,
      type: 'support',
      percentage: 0
    });

    // Calculate resistance levels (ADD: square root + values, then square)
    // Using your specified formula with toFixed(2)
    const resistanceValues = this.gannValues.map((val: number) => ({
      level: parseFloat(Math.pow(sqInput + val, 2).toFixed(2)),
      type: 'resistance',
      percentage: parseInt(((val / 0.291) * 60).toString())
    }) as GannLevel);

    // Calculate support levels (SUBTRACT: square root - values, then square)
    const supportValues = this.gannValues.map((val: number) => ({
      level: parseFloat(Math.pow(sqInput - val, 2).toFixed(2)),
      type: 'support',
      percentage: parseInt(((val / 0.291) * 60).toString())
    }) as GannLevel);

    // Add resistance levels to levels array
    resistanceValues.forEach((e) => this.levels.push(e));

    // Add support levels to levels array
    supportValues.forEach((e) => this.levels.push(e));

    // Sort levels by degree (lowest to highest percentage)
    this.levels.sort((a, b) => a.percentage - b.percentage);

    // Create table rows for column view
    this.createTableRows();

    // Create hexagon visualization data
    this.createHexagonData();

    this.showResults = true;
  }

  private createHexagonData() {
    this.hexagonRings = [];
    const resistanceLevels = this.levels.filter(l => l.type === 'resistance');
    const supportLevels = this.levels.filter(l => l.type === 'support' && l.percentage !== 0);

    // Group levels into rings (2 levels per ring: 1 support, 1 resistance)
    // Or in Gann Hexagon, it's usually 6 levels per ring. 
    // Given the current logic has 6 steps (gannValues), let's create rings accordingly.

    for (let i = 0; i < this.gannValues.length; i++) {
      const ringLevels: GannLevel[] = [];
      if (resistanceLevels[i]) ringLevels.push(resistanceLevels[i]);
      if (supportLevels[i]) ringLevels.push(supportLevels[i]);

      this.hexagonRings.push({ levels: ringLevels });
    }
  }

  private createTableRows() {
    this.tableRows = [];
    const basePrice = this.inputValue!;

    // Get support and resistance levels
    const supportLevels = this.levels.filter(l => l.type === 'support' && l.percentage !== 0);
    const resistanceLevels = this.levels.filter(l => l.type === 'resistance');

    // Create rows with matching percentages
    const allPercentages = new Set<number>();
    supportLevels.forEach(l => allPercentages.add(Math.abs(l.percentage)));
    resistanceLevels.forEach(l => allPercentages.add(l.percentage));

    const sortedPercentages = Array.from(allPercentages).sort((a, b) => a - b);

    for (const pct of sortedPercentages) {
      const support = supportLevels.find(l => Math.abs(l.percentage) === pct);
      const resistance = resistanceLevels.find(l => l.percentage === pct);

      this.tableRows.push({
        degree: pct === 0 ? '0' : pct.toFixed(1),
        support: support?.level ?? null,
        resistance: resistance?.level ?? null
      });
    }
  }

  clear() {
    this.inputValue = null;
    this.levels = [];
    this.showResults = false;
  }
}