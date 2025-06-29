// src/app/login-register/login-register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators'; // ייבוא take

@Component({
  selector: 'app-login-register',
  // standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login-register.html",
  styleUrls: ['./login-register.css'] // <--- הוסף שורה זו

})
export class LoginRegisterComponent {
  isLoginMode = true;
  userData = {
    full_name: '',
    tz: '',
    email: '',
    address: '',
    password: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetUserData(); // איפוס נתונים במעבר בין מצבים
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.authService.login(this.userData).subscribe({
        next: () => {
          // לאחר שה-AuthService יסיים את ה-checkLoginStatus, הוא ינווט
          this.authService.currentUser$.pipe(take(1)).subscribe(user => {
            if (user) {
              if (user.role === 'admin' || user.role === 'member') {
                this.resetUserData();
                this.router.navigate(['/files']);
              } else if (user.role === 'user') {
                this.resetUserData();
                this.router.navigate(['/dashboard']);
              }
            } else {
              this.resetUserData();
              this.router.navigate(['/login']); // למקרה שההתחברות הצליחה אבל לא קיבלנו משתמש
            }
          });
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'שגיאה בהתחברות.';
          console.error('Login error:', err);
        }
      });
    } else {
      this.authService.register(this.userData).subscribe({
        next: () => {
          this.successMessage = 'נרשמת בהצלחה! כעת התחבר.';
          this.isLoginMode = true;
          this.resetUserData();
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'שגיאה בהרשמה.';
          console.error('Register error:', err);
        }
      });
    }
  }

  private resetUserData() {
    this.userData = {
      full_name: '',
      tz: '',
      email: '',
      address: '',
      password: ''
    };
  }
}
