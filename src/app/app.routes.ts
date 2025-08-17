// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register';
import { FileManagerComponent } from './file-manager/file-manager';
import { UserDashboardComponent } from './components/user-dashbord/user-dashbord';
import { roleGuard } from './auth/role.guard';
import { HomePage } from './components/home-page/home-page';
import { News } from './components/news/news';
import { Tradition } from './components/tradition/tradition';
import { AddEventComponent } from './components/add-event/add-event';
import { ImageGalleryComponent } from './image-gallery/image-gallery';
import { DonationComponent } from './components/donation/donation';
import { ApprovedEventsComponent } from './components/approved-events/approved-events';
import { EventListComponent } from './event-list/event-list';
import { ContactComponent } from './components/contact/contact';
import { NewsInfo } from './components/news-info/news-info';
import { TraditionInfo } from './components/tradition-info/tradition-info';
import { NewsEditComponent } from './components/news-edit/news-edit';
import { NewsAddComponent } from './components/news-add/news-add';
import { TraditionAddComponent } from './components/tradition-add/tradition-add';
import { TraditionEditComponent } from './components/tradition-edit/tradition-edit';

export const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },

  {
    path: 'files',
    component: FileManagerComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] }
  },
  {
    path: 'images',
    component: ImageGalleryComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] }
  },
  {
    path: 'admin-events',
    component: EventListComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'homepage',
    component: HomePage,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'news',
    component: News,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
 {
  path: 'edit-news/:id',
  component: NewsEditComponent,
  canActivate: [roleGuard],
  data: { roles: ['admin'] },
  renderMode: 'server'
},
  {
    path: 'add-news',
    component: NewsAddComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
 {
  path: 'news/:id',
  component: NewsInfo,
  canActivate: [roleGuard],
  data: { roles: ['user', 'admin', 'member'] },
  renderMode: 'server'
},
  {
    path: 'tradition',
    component: Tradition,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'add-tradition',
    component: TraditionAddComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
 {
  path: 'tradition/:id',
  component: TraditionInfo,
  canActivate: [roleGuard],
  data: { roles: ['user', 'admin', 'member'] },
  renderMode: 'server'
},
 {
  path: 'edit-tradition/:id',
  component: TraditionEditComponent,
  canActivate: [roleGuard],
  data: { roles: ['admin'] },
  renderMode: 'server'
}
  {
    path: 'events',
    component: ApprovedEventsComponent,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'add-event',
    component: AddEventComponent,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'donation',
    component: DonationComponent,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
