// src/app/login-register/login-register.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-register.html',
  styleUrls: ['./login-register.css']
})
export class LoginRegisterComponent implements OnInit {
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

  ngOnInit(): void {
    console.log('LoginRegisterComponent: ngOnInit called.');
    // בדיקה אם המשתמש כבר מחובר בטעינת הקומפוננטה
    this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      console.log('LoginRegisterComponent: ngOnInit - isLoggedIn$', isLoggedIn);
      if (isLoggedIn) {
        // אם מחובר, נתב אותו לדאשבורד המתאים
        this.authService.currentUser$.pipe(take(1)).subscribe(user => {
          console.log('LoginRegisterComponent: ngOnInit - currentUser$', user);
          if (user) {
            console.log('LoginRegisterComponent: ngOnInit - User is logged in, attempting redirect based on role:', user.role);
            if (user.role === 'admin' || user.role === 'member') {
              this.router.navigate(['/files']);
            } else if (user.role === 'user') {
              this.router.navigate(['/dashboard']);
            }
          } else {
            console.log('LoginRegisterComponent: ngOnInit - User is logged in but currentUser is null. This should not happen.');
          }
        });
      } else {
        console.log('LoginRegisterComponent: ngOnInit - User is not logged in.');
      }
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetUserData();
    console.log('LoginRegisterComponent: Toggle mode to:', this.isLoginMode ? 'Login' : 'Register');
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    console.log('LoginRegisterComponent: onSubmit called. Mode:', this.isLoginMode ? 'Login' : 'Register', 'Email:', this.userData.email);

    if (this.isLoginMode) {
      this.authService.login(this.userData).subscribe({
        next: (user) => { // 'user' יכיל כעת את פרטי המשתמש המעודכנים
          console.log('LoginRegisterComponent: Login successful. User data received from AuthService:', user);
          if (user) {
            console.log('LoginRegisterComponent: Redirecting based on updated user role:', user.role);
            if (user.role === 'admin' || user.role === 'member') {
              this.router.navigate(['/files']);
            } else if (user.role === 'user') {
              this.router.navigate(['/dashboard']);
            }
          } else {
            console.log('LoginRegisterComponent: User is null after login. Staying on login page.');
            this.errorMessage = 'התחברות הצליחה אך לא ניתן לאחזר פרטי משתמש. נסה לרענן.';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'שגיאה בהתחברות.';
          console.error('LoginRegisterComponent: Login error:', err);
        }
      });
    } else {
      this.authService.register(this.userData).subscribe({
        next: () => {
          this.successMessage = 'נרשמת בהצלחה! כעת התחבר.';
          this.isLoginMode = true;
          this.resetUserData();
          console.log('LoginRegisterComponent: Registration successful. Switching to login mode.');
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'שגיאה בהרשמה.';
          console.error('LoginRegisterComponent: Register error:', err);
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
