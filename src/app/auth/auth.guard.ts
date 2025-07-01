// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { take, map } from 'rxjs/operators'; // ייבוא take ו-map
import { Observable } from 'rxjs'; // ייבוא Observable

export const authGuard: CanActivateFn = (
  route, 
  state
): Observable<boolean> => { // הגדרת סוג החזרה כ-Observable<boolean>
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe( // השתמש ב-Observable
    take(1), // קח את הערך הנוכחי וסגור את ה-Observable
    map(isLoggedIn => {
      if (isLoggedIn) {
        console.log('AuthGuard: User is logged in, access granted.');
        return true; // המשתמש מחובר, אפשר להמשיך
      } else {
        console.log('AuthGuard: User is not logged in, redirecting to login.');
        router.navigate(['/login']);
        return false; // המשתמש אינו מחובר, הפנה לדף ההתחברות
      }
    })
  );
};
