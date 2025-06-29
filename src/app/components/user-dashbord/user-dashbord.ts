// src/app/user-dashboard/user-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Observable } from 'rxjs';
import { ImageGalleryComponent } from '../../image-gallery/image-gallery';
import { EventListComponent } from '../../event-list/event-list';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,ImageGalleryComponent,EventListComponent],
  template: `
    <div class="container mt-8 p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto font-inter text-center">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">ברוך הבא למרחב האישי שלך!</h2>
      <p *ngIf="currentUser$ | async as user" class="text-xl text-gray-700 mb-4">
        שלום, {{ user.full_name }} ({{ user.email }}).
      </p>
      <p class="text-lg text-gray-600 mb-8">
        כאן תוכל למצוא מידע וכלים המותאמים במיוחד עבורך כמשתמש רגיל.
      </p>
      
      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h4 class="font-semibold text-blue-800 mb-2">גישה לנתונים אישיים</h4>
          <p class="text-blue-700 text-sm">
            צפה בפרטים האישיים שלך, היסטוריית פעילות, ועוד.
          </p>
        </div>
        <div class="bg-green-50 p-4 rounded-md border border-green-200">
          <h4 class="font-semibold text-green-800 mb-2">עדכונים והודעות</h4>
          <p class="text-green-700 text-sm">
            קבל את העדכונים האחרונים והודעות חשובות ישירות ללוח המחוונים שלך.
          </p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h4 class="font-semibold text-yellow-800 mb-2">תמיכה מהירה</h4>
          <p class="text-yellow-700 text-sm">
            צריך עזרה? פנה אלינו ישירות מלוח המחוונים.
          </p>
        </div>
      </div>

      <button (click)="authService.logout()" class="mt-8 bg-red-500 hover:bg-red-700  font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
        התנתק
      </button>
      <app-image-gallery></app-image-gallery>
      <app-event-list></app-event-list>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  currentUser$: Observable<any | null>;

  constructor(public authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
  }
}
