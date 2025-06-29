// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface UserData {
  id: number;
  email: string;
  full_name: string;
  tz: string;
  address: string;
  role: 'admin' | 'member' | 'user'; // הגדרת סוגי התפקידים
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  // BehaviorSubject לאחסון פרטי המשתמש
  private _currentUser = new BehaviorSubject<UserData | null>(null);
  currentUser$ = this._currentUser.asObservable(); // Observable עבור פרטי המשתמש

  constructor(private http: HttpClient, private router: Router) {
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    this.http.get<UserData>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap((user: UserData) => {
        this._isLoggedIn.next(true);
        this._currentUser.next(user); // שמור את פרטי המשתמש כולל התפקיד
      }),
      catchError((error) => {
        this._isLoggedIn.next(false);
        this._currentUser.next(null); // נקה פרטי משתמש אם לא מחובר
        console.warn('Login status check failed:', error.error?.message || error.message);
        return throwError(error);
      })
    ).subscribe();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(() => {
        // לאחר התחברות מוצלחת, אנו מבצעים שוב בדיקת סטטוס כדי לקבל את פרטי המשתמש המלאים מהשרת
        this.checkLoginStatus();
        // הניתוב ייעשה לאחר ש-checkLoginStatus יסיים ויעדכן את currentUser
      }),
      catchError(error => {
        console.error('Login failed', error);
        this._isLoggedIn.next(false);
        this._currentUser.next(null);
        return throwError(error);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(() => {
        console.log('Registration successful, please log in.');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Registration failed', error);
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Logout successful.');
        this.router.navigate(['/login']);

        this._isLoggedIn.next(false);
        this._currentUser.next(null); // נקה פרטי משתמש בעת התנתקות
      }),
      catchError(error => {
        console.error('Logout failed', error);
        return throwError(error);
      })
    );
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  // מתודה חדשה לבדיקת תפקיד
  hasRole(requiredRoles: ('admin' | 'member' | 'user')[]): boolean {
    const user = this._currentUser.value;
    if (!user) {
      return false; // אין משתמש מחובר
    }
    return requiredRoles.includes(user.role);
  }
}
