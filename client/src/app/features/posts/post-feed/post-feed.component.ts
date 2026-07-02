import { Component, effect, input, signal } from '@angular/core';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  readonly userId = input<string | null>(null);
  protected readonly expandedIds = signal<Set<string>>(new Set());

  constructor(protected readonly postService: PostService) {
    // Refetch automatically whenever the selected user changes.
    effect(() => {
      const id = this.userId();
      if (id) {
        this.postService.loadPosts(id);
      }
    });
    this.postService.connectLiveUpdates(() => this.userId());
  }

  toggleExpand(postId: string): void {
    this.expandedIds.update((current) => {
      const next = new Set(current);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  }

  isExpanded(postId: string): boolean {
    return this.expandedIds().has(postId);
  }

  retry(): void {
    this.postService.retry();
  }
}
