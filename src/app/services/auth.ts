// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs'; // ייבוא 'of'
import { catchError, tap, switchMap, map } from 'rxjs/operators'; // ייבוא 'switchMap' ו-'map'
import { Router } from '@angular/router';
import { API_URL } from './url';

export interface UserData {
  id: number;
  full_name: string;
  tz: string;
  email: string;
  address: string;
  role: string; // 'admin', 'member', 'user'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = API_URL + '/auth';
  private currentUserSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  public currentUser$: Observable<UserData | null> = this.currentUserSubject.asObservable();

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuthStatus().subscribe(); // הפעל את הבדיקה הראשונית ב-constructor
  }

  // שינוי: הפונקציה תחזיר Observable<UserData | null>
  private checkInitialAuthStatus(): Observable<UserData | null> {
    return this.http.get<UserData>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => {
        console.log('AuthService: Initial auth check - User data received', user);
        this.currentUserSubject.next(user);
        this._isLoggedIn.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('AuthService: Initial auth check - Not logged in or token invalid', error);
        this.currentUserSubject.next(null);
        this._isLoggedIn.next(false);
        // נתב לדף ההתחברות רק אם שגיאת 401/403 ורק אם לא נמצאים כבר בדף ההתחברות
        if ((error.status === 401 || error.status === 403) && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
        return of(null); // החזר Observable של null כדי שהשרשרת תמשיך
      })
    );
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData, { withCredentials: true }).pipe(
      tap(response => console.log('AuthService: Login API response received', response)),
      // השתמש ב-switchMap כדי להחליף ל-Observable של checkInitialAuthStatus
      // זה מבטיח ש-checkInitialAuthStatus תסתיים לפני שה-Observable של login יסתיים.
      switchMap(() => {
        console.log('AuthService: Login successful, now calling /me to update user state.');
        return this.checkInitialAuthStatus(); // זה יעדכן את currentUserSubject ו-isLoggedInSubject
      }),
      map(user => { // map את התוצאה הסופית של השרשרת
        console.log('AuthService: Login process complete, user state updated:', user);
        return user; // החזר את פרטי המשתמש או כל דבר אחר שתרצה
      }),
      catchError(this.handleError)
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { withCredentials: true }).pipe(
      tap(response => console.log('AuthService: Register response:', response)),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('AuthService: Logged out successfully.');
        this.currentUserSubject.next(null);
        this._isLoggedIn.next(false);
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.statusText}`;
    }
    console.error('AuthService: HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

 getAllUsers(): Observable<Object> {
  return this.http.get(`http://localhost:5000/users`, { withCredentials: true });
}

}