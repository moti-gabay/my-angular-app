// src/app/auth/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { take, switchMap, catchError } from 'rxjs/operators'; // הוספת catchError
import { of } from 'rxjs'; // הוספת of

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[]; // הורדת את התפקידים הנדרשים מהנתיב

  // וודא שה-AuthService סיים לבדוק את מצב ההתחברות
  // לפני קבלת החלטה על תפקיד.
  return authService.currentUser$.pipe(
    take(1), // לוקח את הערך הנוכחי וסוגר
    switchMap(user => {
      // אם user הוא null אחרי ה-take(1) (כלומר, הבדיקה הראשונית הסתיימה ואין משתמש מחובר)
      if (!user) {
        router.navigate(['/login']);
        return of(false); // החזר Observable של false
      }

      // יש משתמש, עכשיו בדוק את התפקיד
      if (requiredRoles.includes(user.role)) {
        return of(true); // למשתמש יש את התפקיד הנדרש
      } else {
        console.warn(`RoleGuard: Access denied. User role '${user.role}' is not in required roles: ${requiredRoles.join(', ')}`);
        
        // הפניה מחדש לדף מתאים אם אין גישה
        if (user.role === 'user') {
          router.navigate(['/homepage']); // אם זה משתמש רגיל, הפנה לדאשבורד שלו
        } else if (user.role === 'admin' || user.role === 'member') {
          // אם זה אדמין/ממבר שלא יכול לגשת למסך ספציפי (לדוגמה, אם נותנים להם גישה רק ל-files)
          // וודא שהניתוב ברירת מחדל שלהם תקין
          router.navigate(['/files']);
        } else {
          router.navigate(['/']); // או לדף הבית ברירת המחדל
        }
        return of(false);
      }
    }),
    catchError(error => {
      console.error('RoleGuard error:', error);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
