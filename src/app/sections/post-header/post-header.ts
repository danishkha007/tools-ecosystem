import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Post } from '@core/models/post-data';

@Component({
  selector: 'app-post-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-header.html',
  styleUrl: './post-header.scss'
})
export class PostHeaderComponent {
  @Input({ required: true }) post!: Post;

  get readTime(): string {
    const wordsPerMinute = 200;
    const wordCount = this.post?.body?.split(/\s+/).filter(Boolean).length || 0;

    return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
  }
}
