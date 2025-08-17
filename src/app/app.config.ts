import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideServerRendering } from '@angular/platform-server'; // ← השתנה כאן
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideServerRendering(), // ← כאן במקום provideClientHydration()
    provideHttpClient(),
    AuthService,
    provideAnimations(),
    importProvidersFrom(FormsModule),
  ],
};
