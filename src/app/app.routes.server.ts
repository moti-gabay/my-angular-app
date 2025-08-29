import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'news/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'edit-news/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tradition/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'edit-tradition/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
