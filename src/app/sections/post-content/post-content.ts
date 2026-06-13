import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Post } from '@core/models/post-data';

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-content.html',
  styleUrl: './post-content.scss'
})
export class PostContentComponent {
  @Input({ required: true }) post!: Post;
}
