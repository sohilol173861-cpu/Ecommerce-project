import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  success = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this._auth.forgotPassword(this.f.email.value).pipe(
      this._toast.observe({
        loading: 'Sending reset link...',
        success: 'Check your email for reset instructions.',
        error: (e) => e?.error?.message || 'Failed to send. Try again.'
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
