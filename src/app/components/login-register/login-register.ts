// src/app/login-register/login-register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators'; // ייבוא take

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-8 p-4 bg-gray-100 rounded-lg shadow-md max-w-sm mx-auto font-inter">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">{{ isLoginMode ? 'התחברות' : 'הרשמה' }}</h2>

      <div class="mb-4">
        <label for="full_name" class="block text-gray-700 text-sm font-bold mb-2" *ngIf="!isLoginMode">שם מלא:</label>
        <input type="text" id="full_name" [(ngModel)]="userData.full_name" name="full_name" *ngIf="!isLoginMode"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
               placeholder="שם מלא" required>

        <label for="tz" class="block text-gray-700 text-sm font-bold mb-2" *ngIf="!isLoginMode">תעודת זהות:</label>
        <input type="text" id="tz" [(ngModel)]="userData.tz" name="tz" *ngIf="!isLoginMode"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
               placeholder="תעודת זהות" required>

        <label for="address" class="block text-gray-700 text-sm font-bold mb-2" *ngIf="!isLoginMode">כתובת:</label>
        <input type="text" id="address" [(ngModel)]="userData.address" name="address" *ngIf="!isLoginMode"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
               placeholder="כתובת" required>

        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">אימייל:</label>
        <input type="email" id="email" [(ngModel)]="userData.email" name="email"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
               placeholder="אימייל" required>

        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">סיסמה:</label>
        <input type="password" id="password" [(ngModel)]="userData.password" name="password"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
               placeholder="סיסמה" required>
      </div>

      <button class="w-full bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              (click)="onSubmit()">
        {{ isLoginMode ? 'התחבר' : 'הירשם' }}
      </button>

      <p class="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:text-blue-500"
         (click)="toggleMode()">
        {{ isLoginMode ? 'אין לך חשבון? הירשם כאן' : 'יש לך כבר חשבון? התחבר כאן' }}
      </p>

      <div *ngIf="errorMessage" class="text-red-500 text-center mt-3">{{ errorMessage }}</div>
      <div *ngIf="successMessage" class="text-green-500 text-center mt-3">{{ successMessage }}</div>
    </div>
  `
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
                this.router.navigate(['/files']);
              } else if (user.role === 'user') {
                this.router.navigate(['/dashboard']);
              }
            } else {
              this.router.navigate(['/login']); // למקרה שההתחברות הצליחה אבל לא קיבלנו משתמש
            }
          });
        },
        error: (err : any) => {
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
        error: (err : any) => {
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
