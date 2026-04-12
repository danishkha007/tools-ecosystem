import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqSectionComponent, FaqItem } from '../../../../components/faq-section/faq-section';
import { ToolHeaderComponent } from '../../../../components/tool-header/tool-header';
import { AboutSectionComponent } from '../../../../components/about-section/about-section';

interface GannLevel {
  level: number;
  type: 'resistance' | 'support';
  percentage: number;
}

@Component({
  selector: 'app-gann-hexagonal-sr-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, FaqSectionComponent, ToolHeaderComponent, AboutSectionComponent],
  templateUrl: './hexagonal-sr-calculator.html',
  styleUrl: './hexagonal-sr-calculator.scss',
})
export class GannCalculator {
  inputValue: number | null = null;
  levels: GannLevel[] = [];
  showResults = false;
  tableRows: { degree: string; support: number | null; resistance: number | null }[] = [];
  
  // Hexagon Visualization Data
  hexagonRings: { levels: GannLevel[] }[] = [];

  // SEO data
  seoH1 = 'GANN Hexagonal Support & Resistance Calculator';
  seoH2 = 'Calculate Support & Resistance Levels Using GANN Theory';
  tags = ['Free', 'Accurate', 'No Registration', 'Based on GANN Theory', 'Browser-Based'];

  // FAQ Configuration
  faqTitle = 'Frequently Asked Questions';
  faqAccentColor = '#2f84ff';
  expandedFaqIndex: number | null = null;

  faqs: FaqItem[] = [
    {
      question: 'What is the GANN Hexagonal Calculator?',
      answer: 'The GANN Hexagonal Calculator is a tool based on W.D. GANN\'s mathematical trading theory. It calculates support and resistance levels using hexagonal geometry and vibration ratios to help traders identify potential price turning points.'
    },
    {
      question: 'How do I use the GANN Calculator?',
      answer: 'Simply enter any price or number in the input field and click "Calculate". The tool will display multiple resistance levels (above your input) and support levels (below your input) based on GANN\'s mathematical ratios.'
    },
    {
      question: 'What are support and resistance levels?',
      answer: 'Support levels are price points where buying pressure tends to exceed selling pressure, potentially stopping a decline. Resistance levels are price points where selling pressure tends to exceed buying pressure, potentially stopping an advance.'
    },
    {
      question: 'Is this calculator free to use?',
      answer: 'Yes, our GANN Calculator is completely free to use. No registration or account required. All calculations happen locally in your browser.'
    },
    {
      question: 'Can I use this for any type of trading?',
      answer: 'This calculator works with any numerical scale - stocks, forex, commodities, cryptocurrencies, or any numerical analysis. It\'s particularly popular among technical analysts and swing traders.'
    }
  ];

  // GANN square root calculation values
  gannValues = [0.29166, 0.583333, 0.875, 1.1666, 1.458333, 1.75];

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
      percentage: parseInt(((val/0.291)*60).toString())
    }) as GannLevel);

    // Calculate support levels (SUBTRACT: square root - values, then square)
    const supportValues = this.gannValues.map((val: number) => ({
      level: parseFloat(Math.pow(sqInput - val, 2).toFixed(2)),
      type: 'support',
      percentage: parseInt(((val/0.291)*60).toString())
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + 'K';
    }
    return value.toFixed(2);
  }
}