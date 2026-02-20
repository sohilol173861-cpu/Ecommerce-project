import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  loading = false;
  passwordVisible: { current: boolean; new: boolean; confirm: boolean } = {
    current: false,
    new: false,
    confirm: false
  };

  constructor(
    private fb: FormBuilder,
    private _auth: AuthService,
    private _toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
  }

  matchPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const g = control as FormGroup;
    const newP = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    if (newP && confirm && newP !== confirm) {
      return { mismatch: true };
    }
    return null;
  }

  get f() {
    return this.form.controls;
  }

  toggleVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.passwordVisible[field] = !this.passwordVisible[field];
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this._auth.changePassword(this.f.currentPassword.value, this.f.newPassword.value).pipe(
      this._toast.observe({
        loading: 'Updating password...',
        success: 'Password changed successfully.',
        error: (e) => e?.error?.message || 'Failed to change password.'
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.isSubmitted = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
