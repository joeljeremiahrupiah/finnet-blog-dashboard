import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiError } from '../models/api-error.model';

/**
 * Owns all HTTP calls for the Users feature, plus the reactive state (signals) the UI reads from.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  /** Signals exposed as readonly to consumers, only this service can write
   * to them. Components subscribe to state changes automatically just by
   * reading the signal in their template, no manual subscription cleanup.
   */
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches all users and updates the shared signals. Safe to call again for a manual retry.
   */
  loadUsers(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<User[]>(this.baseUrl)
      .pipe(
        tap((users) => {
          this._users.set(users);
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

  private extractMessage(err: { error?: ApiError }): string {
    return err?.error?.message ?? 'Something went wrong while loading users. Please try again.';
  }
}
