// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register';
import { FileManagerComponent } from './file-manager/file-manager';
import { UserDashboardComponent } from './components/user-dashbord/user-dashbord'; // ייבוא הקומפוננטה החדשה
import { roleGuard } from './auth/role.guard'; // ייבוא ה-RoleGuard
import { ImageGalleryComponent } from './image-gallery/image-gallery';
import { EventListComponent } from './event-list/event-list';
import { EventEditorComponent } from './event-editor/event-editor';

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
  {
    path: 'images',
    component: ImageGalleryComponent,
    canActivate: [roleGuard]
  },
  {
    path: 'events', // נתיב לצפייה באירועים (לכל המשתמשים המאומתים)
    component: EventListComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member', 'user'] } // כל התפקידים יכולים לצפות
  },
  {
    path: 'events/admin', // נתיב לניהול אירועים (רשימת עריכה/מחיקה)
    component: EventEditorComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin'] } // רק מנהלים יכולים לנהל אירועים
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // ברירת מחדל: הפנה ללוגין
  { path: '**', redirectTo: '/login' } // לכל נתיב לא ידוע
];
