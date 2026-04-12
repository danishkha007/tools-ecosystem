import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmazonAdComponent } from "../amazon-ad/amazon-ad";

@Component({
  selector: 'app-tool-header',
  standalone: true,
  imports: [CommonModule, AmazonAdComponent],
  templateUrl: './tool-header.html',
  styleUrls: ['./tool-header.scss']
})
export class ToolHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() tags: string[] = ['Free', 'Accurate', 'No Registration', 'Browser-Based'];
}