import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InstructionalSection } from '@core/models/tool-data.model';

@Component({
  selector: 'app-instructional-layer',
  templateUrl: './instructional-layer.html',
  styleUrls: ['./instructional-layer.scss'],
  imports: [CommonModule]
})
export class InstructionalLayerComponent {
  @Input() data?: InstructionalSection;
}
