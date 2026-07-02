import { Component, signal } from '@angular/core';
import { UserListComponent } from '../features/users/user-list/user-list.component';
import { UserDetailCardComponent } from '../features/users/user-detail-card/user-detail-card.component';
import { User } from '../core/models/user.model';
import { PostFeedComponent } from '../features/posts/post-feed/post-feed.component';
import { CreatePostFormComponent } from '../features/posts/create-post-form/create-post-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserListComponent, UserDetailCardComponent, PostFeedComponent, CreatePostFormComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly selectedUser = signal<User | null>(null);

  onUserSelected(user: User): void {
    this.selectedUser.set(user);
  }
}
