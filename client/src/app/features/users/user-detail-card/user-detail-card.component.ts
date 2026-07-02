import { Component, input } from '@angular/core';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail-card',
  standalone: true,
  templateUrl: './user-detail-card.component.html',
  styleUrl: './user-detail-card.component.scss',
})
export class UserDetailCardComponent {
  readonly user = input<User | null>(null);
}
