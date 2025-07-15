import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; // ייבוא נכון
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),   // ← זה פותר את הבעיה
    AuthService,
    provideAnimations(),// חובה כדי לאפשר אנימציות
    importProvidersFrom(FormsModule), // ייבא את FormsModule גלובלית
    // importProvidersFrom(MatIconModule),
    // EventService // או provideEventService() אם הוא standalone


  ],

};
