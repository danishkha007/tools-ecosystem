import { Component, Input } from '@angular/core';
import { ComparisonSection } from '@core/models/tool-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comparison-layer',
  templateUrl: './comparison-layer.html',
  styleUrls: ['./comparison-layer.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ComparisonLayerComponent {
  @Input() data?: ComparisonSection;

  getValueClass(value: any): string {
    const val = Array.isArray(value) ? value[0] : value;
    if (!val) return 'badge-neutral';

    const normalized = val.toString().trim().toLowerCase();
    if (['yes', '✓', '✔', 'true', 'instant', 'unlimited', 'you'].includes(normalized) ||
        normalized.includes('yes') || normalized.includes('✓') || normalized.includes('✔') || normalized.includes('true')) {
      return 'badge-success';
    }

    if (['no', '✗', '✘', 'false', 'slower', 'restrictive'].includes(normalized) ||
        normalized.includes('no') || normalized.includes('✗') || normalized.includes('✘') || normalized.includes('false')) {
      return 'badge-error';
    }

    return 'badge-neutral';
  }

}
