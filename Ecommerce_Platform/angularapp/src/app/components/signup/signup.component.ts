import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  baseUrl: string = 'https://8080-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io'; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]], // ✅ stricter email validation
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  // ✅ Custom validator: check if password and confirmPassword match
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  // ✅ Custom email validator (stricter than Angular’s built-in)
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const value = control.value;
    if (value && !emailRegex.test(value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // ✅ Handle form submit
  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) return;

    this.loading = true;

    const payload = {
      username: this.f.username.value,
      email: this.f.email.value.toLowerCase(),
      password: this.f.password.value,
      role: 'user'  // Automatically assign role as "user"
    };

    this.http.post(`${this.baseUrl}/signup`, payload, { 
      observe: 'response',
      responseType: 'text' 
    }).subscribe({
      next: (response: HttpResponse<string>) => {
        this.loading = false;
        if (response.status === 200 || response.status === 201) {
          alert('✅ Signup successful! Please login now.');
          this.signupForm.reset();
          this.submitted = false;
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          alert(`⚠️ ${err.error}`);
        } else if (err.status === 400) {
          alert(`⚠️ Bad request: ${err.error}`);
        } else {
          alert('❌ Signup failed. Please try again.');
        }
      }
    });
  }
}
