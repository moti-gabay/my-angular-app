// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // הסרתי provideBrowserGlobalErrorListeners, provideZonelessChangeDetection אם לא בשימוש
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // שימוש ב-withInterceptors במקום withInterceptorsFromDi
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser'; // הסרתי withEventReplay אם לא בשימוש מפורש
import { AuthService } from './services/auth';
import { FormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon'; // אם אתה משתמש ב-MatIconModule, וודא שהוא מיובא ומוגדר

export const appConfig: ApplicationConfig = {
  providers: [
    // הגדרת HttpClient עם Interceptors (הדרך המודרנית)
    // אם אתה משתמש ב-HTTP_INTERCEPTORS ישנים, השאר את withInterceptorsFromDi()
    // אם לא, provideHttpClient() לבד מספיק
    provideHttpClient(
      // אם אתה רוצה להשתמש ב-Interceptors מבוססי פונקציות (Angular 15.2+), הוסף אותם כאן:
      // withInterceptors([myInterceptorFunction]),
      // אם אתה עדיין משתמש ב-HTTP_INTERCEPTORS מבוססי DI (כמו ב-AuthService), השאר את זה:
      // withInterceptorsFromDi()
    ),
    
    // אם אתה משתמש ב-BrowserGlobalErrorListeners, השאר אותו
    // provideBrowserGlobalErrorListeners(), 
    
    // אם אתה משתמש ב-ZonelessChangeDetection, השאר אותו (פיצ'ר מתקדם)
    // provideZonelessChangeDetection(), 
    
    provideRouter(routes), // ספק את הניתובים
    
    // אם אתה משתמש ב-Client Hydration, השאר אותו
    provideClientHydration(), 
    
    AuthService, // ספק את AuthService
    
    provideAnimations(), // חובה כדי לאפשר אנימציות
    
    importProvidersFrom(FormsModule), // ייבא את FormsModule גלובלית (אם נחוץ)
    
    // אם אתה משתמש ב-MatIconModule, בטל את ההערה:
    // importProvidersFrom(MatIconModule),
    
    // אם יש לך שירותים נוספים שצריכים להיות מסופקים גלובלית, הוסף אותם כאן:
    // EventService, // אם EventService לא מסופק ב-root
  ],
};
