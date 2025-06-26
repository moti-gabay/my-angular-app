// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // המשתמש מחובר, אפשר להמשיך
  } else {
    // המשתמש אינו מחובר, הפנה לדף ההתחברות
    router.navigate(['/login']);
    return false;
  }
};
