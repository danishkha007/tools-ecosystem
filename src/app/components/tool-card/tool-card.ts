import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Tool } from '../../core/models/tool';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tool-card',
  templateUrl: './tool-card.html',
  styleUrls: ['./tool-card.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ToolCardComponent {

  @Input() tool!: Tool;

  constructor(private router: Router) {}

  navigate() {
    window.scrollTo(0, 0);
    this.router.navigate([this.tool.route]);
  }
}
