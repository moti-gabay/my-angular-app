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
  // standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl:"./event-editor.html",
  styleUrls:["./event-editor.css"]
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
      this.eventService.updateEvent(this.event._id!, this.event).subscribe({
        next: (res) => {
          this.showMessage('האירוע עודכן בהצלחה!', 'success');
          // console.log('Event updated:', res);
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
          // console.log('Event created:', res);
          this.resetForm();
          this.fetchEventsForAdmin(); // רענן רשימה
          // אופציונלי: נווט לעמוד העריכה של האירוע החדש
          this.router.navigate(['/events/admin', res._id]);
        },
        error: (err) => {
          this.showMessage('שגיאה ביצירת האירוע: ' + (err.error?.message || err.message), 'error');
          console.error('Error creating event:', err);
        }
      });
    }
  }

  deleteEvent(): void {
    if (this.event._id && confirm('האם אתה בטוח שברצונך למחוק אירוע זה?')) { // השתמש ב-confirm זמני
      this.eventService.deleteEvent(this.event._id).subscribe({
        next: () => {
          this.showMessage('האירוע נמחק בהצלחה!', 'success');
          // console.log('Event deleted.');
          this.router.navigate(['/events/admin']); // נווט חזרה לרשימת הניהול
        },
        error: (err) => {
          this.showMessage('שגיאה במחיקת האירוע: ' + (err.error?.message || err.message), 'error');
          console.error('Error deleting event:', err);
        }
      });
    }
  }

  deleteEventFromList(eventId: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק אירוע זה מהרשימה?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.showMessage('האירוע נמחק בהצלחה!', 'success');
          // console.log('Event deleted from list.');
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
