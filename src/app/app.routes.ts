// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register';
import { FileManagerComponent } from './file-manager/file-manager';
import { UserDashboardComponent } from './components/user-dashbord/user-dashbord'; // ייבוא הקומפוננטה
import { roleGuard } from './auth/role.guard'; // ייבוא ה-RoleGuard
import { HomePage } from './components/home-page/home-page';
import { News } from './components/news/news';
import { Tradition } from './components/tradition/tradition';
import { Events } from './components/events/events';
import { ContactComponent } from './components/contact/contact';
import { ImageGalleryComponent } from './image-gallery/image-gallery';
import { Donation } from './components/donation/donation';
import { ApprovedEventsComponent } from './components/approved-events/approved-events';
import { EventListComponent } from './event-list/event-list';

export const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },
  {
    path: 'files',
    component: FileManagerComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] } // רק אדמין וחבר יכולים לגשת למסך הקבצים
  },
  {
    path: 'images',
    component: ImageGalleryComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] } // רק אדמין וחבר יכולים לגשת למסך הקבצים
  },
   {
    path: 'admin-events', // נתיב עבור "ארועים" (אם זהו נתיב נפרד מניהול אירועים לאדמין)
    component: EventListComponent, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['user'] } // רק משתמש רגיל יכול לגשת למסך זה
  },
  // ניתובים חדשים עבור משתמשים רגילים
  {
    path: 'homepage', // נתיב עבור "מי אנחנו"
    component: HomePage, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'news', // נתיב עבור "חדשות ופרסומים"
    component: News, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'tradition', // נתיב עבור "המסורת היהודית"
    component: Tradition, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'events', 
    component: ApprovedEventsComponent, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'contact', 
    component: ContactComponent, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'donation', 
    component: Donation, // placeholder component
    canActivate: [roleGuard],
    data: { roles: ['user'] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // ברירת מחדל: הפנה ללוגין
  { path: '**', redirectTo: '/login' } // לכל נתיב לא ידוע
];
