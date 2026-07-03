import { Component, effect, OnInit, output, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  readonly userSelected = output<User>();
  protected readonly selectedId = signal<string | null>(null);

  constructor(protected readonly userService: UserService) {
    effect(() => {
      const users = this.userService.users();
      if (users.length > 0 && !this.selectedId()) {
        const firstUser = users[0];
        this.selectUser(firstUser);
      }
    });
  }

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  selectUser(user: User): void {
    this.selectedId.set(user.id);
    this.userSelected.emit(user);
  }

  protected getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  retry(): void {
    this.userService.loadUsers();
  }
}