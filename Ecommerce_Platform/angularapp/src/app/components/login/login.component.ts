import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginStateService } from '../../services/login-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  private baseUrl = 'https://8080-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private loginState: LoginStateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;

    const payload = {
      email: this.f.email.value.toLowerCase(),
      password: this.f.password.value,
      role: this.f.role.value
    };

    this.http.post(`${this.baseUrl}/login`, payload, {
        observe: 'response',
        responseType: 'text'
      })
      .subscribe({
        next: (response: HttpResponse<string>) => {
          this.loading = false;
          if (response.status === 200) {
            alert('✅ Login successful!');
            localStorage.setItem('currentUser', JSON.stringify({
              email: payload.email,
              role: payload.role
            }));

            this.loginState.setLoginStatus(true);

            this.loginForm.reset();
            this.submitted = false;

            if (payload.role.toLowerCase() === 'admin') {
              this.router.navigate(['/adminlist']);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) {
            if (err.error.includes("email")) {
              alert("❌ Invalid email. Please enter the correct email.");
            } else if (err.error.includes("password")) {
              alert("❌ Invalid password. Please enter the correct password.");
            } else {
              alert("❌ Invalid login credentials!");
            }
          } else if (err.status === 403) {
            // Handle invalid role explicitly
            alert("❌ Invalid role. Please select the correct role.");
          } else if (err.status === 404) {
            alert("⚠️ User not found! Please signup.");
          } else {
            alert("⚠️ Something went wrong, please try again.");
          }
        }
      });
  }
}
