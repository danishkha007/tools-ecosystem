import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InstructionalSection } from '@core/models/tool-data.model';
import { CardComponent } from "@components/card/card";

@Component({
  selector: 'app-instructional-layer',
  templateUrl: './instructional-layer.html',
  styleUrls: ['./instructional-layer.scss'],
  imports: [CommonModule, CardComponent]
})
export class InstructionalLayerComponent {
  @Input() data?: InstructionalSection;
}
