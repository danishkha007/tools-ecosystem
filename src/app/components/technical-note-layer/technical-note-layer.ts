import { Component, Input } from '@angular/core';
import { TechnicalNoteSection } from '@core/models/tool-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technical-note-layer',
  templateUrl: './technical-note-layer.html',
  styleUrls: ['./technical-note-layer.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TechnicalNoteLayerComponent {
  @Input() data?: TechnicalNoteSection;
}
