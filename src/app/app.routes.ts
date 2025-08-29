import { Routes } from '@angular/router';
import { roleGuard } from './auth/role.guard';
import { NewsService } from './services/news';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './services/url';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login-register/login-register').then(m => m.LoginRegisterComponent) },

  {
    path: 'files',
    loadComponent: () => import('./file-manager/file-manager').then(m => m.FileManagerComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] }
  },
  {
    path: 'homepage',
    loadComponent: () => import('./components/home-page/home-page').then(m => m.HomePage),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] }
  },
  {
    path: 'images',
    loadComponent: () => import('./image-gallery/image-gallery').then(m => m.ImageGalleryComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'member'] }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/user-dashbord/user-dashbord').then(m => m.UserDashboardComponent),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },

  // news routes
  {
    path: 'news',
    loadComponent: () => import('./components/news/news').then(m => m.News),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./components/news-info/news-info').then(m => m.NewsInfo),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] },
    getPrerenderParams: async () => {
      // This is the new endpoint you just created
      const res = await fetch(`${API_URL}/news/ids`);
      const ids = await res.json();

      // The endpoint now returns an array of strings (e.g., ["id1", "id2"])
      // You need to map it to the expected format: [{ id: 'id1' }, { id: 'id2' }]
      return ids.map((id: string) => ({ id }));
    }
  } as any,
  {
    path: 'edit-news/:id',
    loadComponent: () => import('./components/news-edit/news-edit').then(m => m.NewsEditComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
    getPrerenderParams:async () => {
      // This is the new endpoint you just created
      const res = await fetch(`${API_URL}/news/ids`);
      const ids = await res.json();

      // The endpoint now returns an array of strings (e.g., ["id1", "id2"])
      // You need to map it to the expected format: [{ id: 'id1' }, { id: 'id2' }]
      return ids.map((id: string) => ({ id }));
    }
  } as any,
  {
    path: 'add-news',
    loadComponent: () => import('./components/news-add/news-add').then(m => m.NewsAddComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },

  // tradition routes
  {
    path: 'tradition',
    loadComponent: () => import('./components/tradition/tradition').then(m => m.Tradition),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'tradition/:id',
    loadComponent: () => import('./components/tradition-info/tradition-info').then(m => m.TraditionInfo),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] },
    getPrerenderParams: async () => {
      // This is the new endpoint you just created
      const res = await fetch(`${API_URL}/tradition/ids`);
      const ids = await res.json();

      // The endpoint now returns an array of strings (e.g., ["id1", "id2"])
      // You need to map it to the expected format: [{ id: 'id1' }, { id: 'id2' }]
      return ids.map((id: string) => ({ id }));
    }
  } as any,
  {
    path: 'edit-tradition/:id',
    loadComponent: () => import('./components/tradition-edit/tradition-edit').then(m => m.TraditionEditComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
    getPrerenderParams: async () => {
      // This is the new endpoint you just created
      const res = await fetch(`${API_URL}/tradition/ids`);
      const ids = await res.json();

      // The endpoint now returns an array of strings (e.g., ["id1", "id2"])
      // You need to map it to the expected format: [{ id: 'id1' }, { id: 'id2' }]
      return ids.map((id: string) => ({ id }));
    }
  },
  {
    path: 'add-tradition',
    loadComponent: () => import('./components/tradition-add/tradition-add').then(m => m.TraditionAddComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },

  // events
  {
    path: 'events',
    loadComponent: () => import('./components/approved-events/approved-events').then(m => m.ApprovedEventsComponent),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'admin-events',
    loadComponent: () => import('./event-list/event-list').then(m => m.EventListComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },

  // contact / donation / add-event
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact').then(m => m.ContactComponent),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'add-event',
    loadComponent: () => import('./components/add-event/add-event').then(m => m.AddEventComponent),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },
  {
    path: 'donation',
    loadComponent: () => import('./components/donation/donation').then(m => m.DonationComponent),
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'member'] }
  },

  // redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
