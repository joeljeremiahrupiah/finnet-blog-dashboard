import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { ApiError } from '../../../core/models/api-error.model';

interface ValidationApiError {
  error?: ApiError & { fieldErrors?: Record<string, string> };
}

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-post-form.component.html',
  styleUrl: './create-post-form.component.scss',
})
export class CreatePostFormComponent {
  readonly userId = input.required<string>();
  readonly postCreated = output<void>();

  protected readonly isExpanded = signal(false);
  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly postService: PostService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  expandForm(): void {
    this.isExpanded.set(true);
  }

  collapseForm(event: Event): void {
    event.stopPropagation();
    this.form.reset();
    this.isExpanded.set(false);
    this.serverError.set(null);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  errorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !(control.touched || control.dirty)) return null;
    if (control.errors?.['required']) return 'This field is required.';
    if (control.errors?.['server']) return control.errors['server'];
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.serverError.set(null);

    const { title, body } = this.form.value;
    this.postService.createPost(this.userId(), title!, body!).subscribe({
      next: () => {
        this.form.reset();
        this.submitting.set(false);
        this.isExpanded.set(false);
        this.postCreated.emit();
      },
      error: (err: ValidationApiError) => {
        this.submitting.set(false);
        const fieldErrors = err.error?.fieldErrors;
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            this.form.get(field)?.setErrors({ server: message });
          });
        } else {
          this.serverError.set(err.error?.message ?? 'Could not create post. Please try again.');
        }
      },
    });
  }
}
