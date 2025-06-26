// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register';
import { FileManagerComponent } from './file-manager/file-manager';
import { UserDashboardComponent } from './components/user-dashbord/user-dashbord'; // ייבוא הקומפוננטה החדשה
import { roleGuard } from './auth/role.guard'; // ייבוא ה-RoleGuard

export const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },
  {
    path: 'files',
    component: FileManagerComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] } // רק אדמין וחבר יכולים לגשת למסך הקבצים
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['user'] } // רק משתמש רגיל יכול לגשת למסך זה
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // ברירת מחדל: הפנה ללוגין
  { path: '**', redirectTo: '/login' } // לכל נתיב לא ידוע
];
