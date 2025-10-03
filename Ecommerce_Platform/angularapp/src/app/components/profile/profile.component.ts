import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser!: User | null;

  nameForm!: FormGroup;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;

  private baseUrl = 'https://8080-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // ✅ Load current user from backend using email stored in localStorage
    const localUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (localUser?.email) {
      this.http.get<User>(`${this.baseUrl}/profile/${localUser.email}`).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.initForms(user);
        },
        error: (err) => {
          console.error('❌ Failed to load user profile:', err);
          alert('⚠️ Failed to load profile info!');
        }
      });
    }
  }

  private initForms(user: User) {
    // Name form
    this.nameForm = this.fb.group({
      username: [user.username || '', [Validators.required, Validators.minLength(3)]],
    });

    // Email form
    this.emailForm = this.fb.group({
      oldEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email]]
    });

    // Password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 🔹 Change name
  changeName() {
    if (this.nameForm.invalid || !this.currentUser) return;
    this.currentUser.username = this.nameForm.value.username;

    this.http.put(`${this.baseUrl}/profile/${this.currentUser.id}`, this.currentUser,
      { observe: 'response', responseType: 'text' })
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            alert('✅ Name updated successfully!');
          }
        },
        error: (err) => console.error('❌ Error updating name:', err)
      });
  }

  // 🔹 Change email
  changeEmail() {
    if (this.emailForm.invalid || !this.currentUser) return;

    const { oldEmail, password, newEmail } = this.emailForm.value;

    if (oldEmail !== this.currentUser.email) {
      alert('❌ Old email is incorrect!');
      return;
    }

    if (password !== this.currentUser.password) {
      alert('❌ Password is incorrect!');
      return;
    }

    this.currentUser.email = newEmail;

    this.http.put(`${this.baseUrl}/profile/${this.currentUser.id}`, this.currentUser,
      { observe: 'response', responseType: 'text' })
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            alert('✅ Email updated successfully!');
            localStorage.setItem('currentUser', JSON.stringify({ email: newEmail, role: this.currentUser?.role }));
            this.emailForm.reset();
          }
        },
        error: (err) => console.error('❌ Error updating email:', err)
      });
  }

  // 🔹 Change password
  changePassword() {
    if (this.passwordForm.invalid || !this.currentUser) return;

    const { currentPassword, newPassword } = this.passwordForm.value;

    if (currentPassword !== this.currentUser.password) {
      alert('❌ Current password is incorrect!');
      return;
    }

    this.currentUser.password = newPassword;

    this.http.put(`${this.baseUrl}/profile/${this.currentUser.id}`, this.currentUser,
      { observe: 'response', responseType: 'text' })
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            alert('✅ Password updated successfully!');
            this.passwordForm.reset();
          }
        },
        error: (err) => console.error('❌ Error updating password:', err)
      });
  }
}
