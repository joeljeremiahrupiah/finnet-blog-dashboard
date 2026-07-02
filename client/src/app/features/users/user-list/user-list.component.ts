import { Component, OnInit, output, signal } from '@angular/core';
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

  constructor(protected readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  selectUser(user: User): void {
    this.selectedId.set(user.id);
    this.userSelected.emit(user);
  }

  retry(): void {
    this.userService.loadUsers();
  }
}