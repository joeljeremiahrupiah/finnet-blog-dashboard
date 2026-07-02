import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post.model';
import { ApiError } from '../models/api-error.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly baseUrl = environment.apiBaseUrl;

  private readonly _posts = signal<Post[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly posts = this._posts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  private lastUserId: string | null = null;
  private eventSource: EventSource | null = null;

  constructor(private readonly http: HttpClient) {}

  loadPosts(userId: string): void {
    this.lastUserId = userId;
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<Post[]>(`${this.baseUrl}/users/${userId}/posts`)
      .pipe(
        tap((posts) => {
          this._posts.set(posts);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._error.set(this.extractMessage(err));
          this._loading.set(false);
          return throwError(() => err);
        }),
      )
      .subscribe();
  }

  retry(): void {
    if (this.lastUserId) {
      this.loadPosts(this.lastUserId);
    }
  }

  /**
   * Sends the create request only does not insert the result into the feed directly.
   */
  createPost(userId: string, title: string, body: string) {
    return this.http.post<Post>(`${this.baseUrl}/users/${userId}/posts`, { title, body });
  }

  // Prepends a post received via SSE, guarding against any duplicate event delivery.
  private prependPost(post: Post): void {
    this._posts.update((current) =>
      current.some((p) => p.id === post.id) ? current : [post, ...current],
    );
  }

  connectLiveUpdates(currentUserId: () => string | null): void {
    if (this.eventSource) return;

    this.eventSource = new EventSource(`${this.baseUrl}/live/posts`);
    this.eventSource.addEventListener('post-created', (event: MessageEvent) => {
      const post: Post = JSON.parse(event.data);
      if (post.userId === currentUserId()) {
        this.prependPost(post);
      }
    });
  }

  disconnectLiveUpdates(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }

  private extractMessage(err: { error?: ApiError }): string {
    return err?.error?.message ?? 'Something went wrong while loading posts. Please try again.';
  }
}
