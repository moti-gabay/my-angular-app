// src/app/event-editor/event-editor.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, EventRecord } from '../services/event';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // לייבוא לניווט וקבלת פרמטרים
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; // לייבוא of

@Component({
  selector: 'app-event-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <div class="container mt-8 p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto font-inter">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ isEditMode ? 'ערוך אירוע' : 'צור אירוע חדש' }}
      </h2>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2">כותרת האירוע:</label>
          <input type="text" id="title" [(ngModel)]="event.title" name="title" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div>
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">תיאור:</label>
          <textarea id="description" [(ngModel)]="event.description" name="description" rows="4"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>

        <div>
          <label for="date" class="block text-gray-700 text-sm font-bold mb-2">תאריך ושעה:</label>
          <input type="datetime-local" id="date" [(ngModel)]="event.date" name="date" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div>
          <label for="location" class="block text-gray-700 text-sm font-bold mb-2">מיקום:</label>
          <input type="text" id="location" [(ngModel)]="event.location" name="location"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div class="flex items-center">
          <input type="checkbox"  [(ngModel)]="event.is_approved" name=""
                 class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
          <label for="" class="text-gray-700 text-sm font-bold">אירוע מאושר (גלוי לכולם)</label>
        </div>

        <button type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
          {{ isEditMode ? 'שמור שינויים' : 'צור אירוע' }}
        </button>

        <button *ngIf="isEditMode" type="button" (click)="deleteEvent()"
                class="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
          מחק אירוע
        </button>
      </form>

      <div *ngIf="message" class="text-center mt-4 p-3 rounded-md {{ messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
        {{ message }}
      </div>

      <div class="mt-6 text-center">
        <a routerLink="/events/admin" class="text-blue-500 hover:underline">חזרה לרשימת ניהול אירועים</a>
      </div>
    </div>

    <div class="container mt-8 p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto font-inter">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">רשימת אירועים לניהול</h3>
      <div *ngIf="loadingEvents" class="text-center text-gray-600">טוען אירועים...</div>
      <div *ngIf="eventsForAdmin.length > 0" class="space-y-3">
        <div *ngFor="let ev of eventsForAdmin" 
             class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
          <div class="flex-grow">
            <span class="font-semibold text-gray-800">{{ ev.title }}</span> - 
            <span class="text-gray-600 text-sm">{{ ev.date | date:'short' }}</span>
            <span class="text-gray-500 text-xs ml-2" [class.text-green-600]="ev.is_approved" [class.text-red-600]="!ev.is_approved">
              ({{ ev.is_approved ? 'מאושר' : 'לא מאושר' }})
            </span>
          </div>
          <div>
            <a [routerLink]="['/events/admin', ev.id]" 
               class="inline-flex items-center px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full hover:bg-yellow-600 transition duration-200 mr-2">
               ערוך
            </a>
            <button (click)="deleteEventFromList(2)" 
                    class="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition duration-200">
               מחק
            </button>
          </div>
        </div>
      </div>
      <div *ngIf="!loadingEvents && eventsForAdmin.length === 0" class="text-center text-gray-500 p-4">
        אין אירועים לניהול.
      </div>
      <div class="mt-6 text-center">
        <a routerLink="/events/admin/new" class="inline-flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition duration-300">
          + צור אירוע חדש
        </a>
      </div>
    </div>
  `
})
export class EventEditorComponent implements OnInit {
  event: EventRecord = {
    title: '',
    description: '',
    date: '', // יאותחל לתאריך ושעה נוכחיים
    location: ''
  };
  isEditMode: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  eventsForAdmin: EventRecord[] = []; // רשימת אירועים לצורך תצוגה ועריכה
  loadingEvents: boolean = true;


  constructor(
    private eventService: EventService,
    private route: ActivatedRoute, // לקבלת פרמטרי נתיב (כמו ID)
    private router: Router // לניתוב לאחר פעולות
  ) { }

  ngOnInit(): void {
    // אתחול תאריך ושעה נוכחיים עבור יצירת אירוע חדש
    const now = new Date();
    this.event.date = now.toISOString().slice(0, 16); // פורמט YYYY-MM-DDTHH:MM ל-datetime-local input

    // בדיקה אם אנחנו במצב עריכה (אם יש ID בנתיב)
    this.route.paramMap.pipe(
      switchMap(params => {
        const eventId = params.get('id');
        if (eventId) {
          this.isEditMode = true;
          return this.eventService.getEventById(+eventId);
        } else {
          this.isEditMode = false;
          return of(null); // אם אין ID, זה מצב יצירה חדש
        }
      })
    ).subscribe({
      next: (eventData) => {
        if (eventData) {
          this.event = eventData;
          // וודא שתאריך מומר לפורמט הנכון עבור datetime-local
          if (this.event.date) {
            this.event.date = new Date(this.event.date).toISOString().slice(0, 16);
          }
        }
        this.fetchEventsForAdmin(); // טען את הרשימה לאחר הטעינה של האירוע הנוכחי
      },
      error: (err) => {
        this.showMessage('שגיאה בטעינת פרטי האירוע: ' + (err.error?.message || err.message), 'error');
        console.error('Error loading event for edit:', err);
        this.isEditMode = false; // חזור למצב יצירה אם לא נטען
        this.fetchEventsForAdmin();
      }
    });

    // טען את כל האירועים עבור תצוגת הניהול
    if (!this.isEditMode) { // אם לא במצב עריכה ספציפי, טען מיד את הרשימה
       this.fetchEventsForAdmin();
    }
  }

  fetchEventsForAdmin(): void {
    this.loadingEvents = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.eventsForAdmin = data;
        this.loadingEvents = false;
      },
      error: (err) => {
        this.showMessage('שגיאה בטעינת רשימת האירועים לניהול: ' + (err.error?.message || err.message), 'error');
        this.loadingEvents = false;
        console.error('Error fetching events for admin:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.eventService.updateEvent(this.event.id!, this.event).subscribe({
        next: (res) => {
          this.showMessage('האירוע עודכן בהצלחה!', 'success');
          console.log('Event updated:', res);
          this.fetchEventsForAdmin(); // רענן רשימה
        },
        error: (err) => {
          this.showMessage('שגיאה בעדכון האירוע: ' + (err.error?.message || err.message), 'error');
          console.error('Error updating event:', err);
        }
      });
    } else {
      this.eventService.createEvent(this.event).subscribe({
        next: (res) => {
          this.showMessage('האירוע נוצר בהצלחה!', 'success');
          console.log('Event created:', res);
          this.resetForm();
          this.fetchEventsForAdmin(); // רענן רשימה
          // אופציונלי: נווט לעמוד העריכה של האירוע החדש
          this.router.navigate(['/events/admin', res.id]);
        },
        error: (err) => {
          this.showMessage('שגיאה ביצירת האירוע: ' + (err.error?.message || err.message), 'error');
          console.error('Error creating event:', err);
        }
      });
    }
  }

  deleteEvent(): void {
    if (this.event.id && confirm('האם אתה בטוח שברצונך למחוק אירוע זה?')) { // השתמש ב-confirm זמני
      this.eventService.deleteEvent(this.event.id).subscribe({
        next: () => {
          this.showMessage('האירוע נמחק בהצלחה!', 'success');
          console.log('Event deleted.');
          this.router.navigate(['/events/admin']); // נווט חזרה לרשימת הניהול
        },
        error: (err) => {
          this.showMessage('שגיאה במחיקת האירוע: ' + (err.error?.message || err.message), 'error');
          console.error('Error deleting event:', err);
        }
      });
    }
  }

  deleteEventFromList(eventId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק אירוע זה מהרשימה?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.showMessage('האירוע נמחק בהצלחה!', 'success');
          console.log('Event deleted from list.');
          this.fetchEventsForAdmin(); // רענן את הרשימה לאחר המחיקה
        },
        error: (err) => {
          this.showMessage('שגיאה במחיקת האירוע: ' + (err.error?.message || err.message), 'error');
          console.error('Error deleting event from list:', err);
        }
      });
    }
  }

  private resetForm(): void {
    this.event = {
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      location: ''
    };
    this.isEditMode = false;
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000); // נקה הודעה לאחר 5 שניות
  }
}
