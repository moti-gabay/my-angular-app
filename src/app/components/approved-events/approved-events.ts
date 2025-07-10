import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventRecord, EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-approved-events',
  templateUrl: './approved-events.html',
  styleUrls: ['./approved-events.css'],
  imports: [CommonModule, DatePipe], // ⬅️ תוסיף כאן

})
export class ApprovedEventsComponent implements OnInit {

  approvedEvents: EventRecord[] = [];
  selectedEvent: EventRecord | null = null;
  confirmationMessage: string = '';

  currentUser: any;

  constructor(private eventService: EventService, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchApprovedEvents();
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  fetchApprovedEvents(): void {
    this.eventService.getApprovedEvents().subscribe({
      next: (events) => {
        const now = new Date(); // תאריך ושעה נוכחיים

        // סנן רק אירועים עתידיים
        this.approvedEvents = events.filter(event => {
          if (!event.date || !event.time) {
            return false; // התעלם מאירועים ללא תאריך או שעה מוגדרים
          }

          // יצירת אובייקט Date עבור האירוע
          // נניח ש-event.date הוא בפורמט 'YYYY-MM-DD' ו-event.time הוא 'HH:MM:SS'
          const eventDateTimeString = `${event.date}T${event.time}`;
          const eventDate = new Date(eventDateTimeString);

          return eventDate > now; // החזר רק אירועים שתאריכם ושעתם בעתיד
        });

        // מיון האירועים העתידיים לפי תאריך (מהקרוב לרחוק)
        this.approvedEvents.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`).getTime();
          const dateB = new Date(`${b.date}T${b.time}`).getTime();
          return dateA - dateB;
        }); this.cdr.detectChanges(); // מוסיף רענון ידני
      },
      error: (err) => console.error('Error loading approved events', err)
    });
  }

  unapproveEvent(eventId: number): void {
    if (confirm('האם אתה בטוח שברצונך לבטל את אישור הגעה לאירוע?')) {
      this.eventService.unapproveEvent(eventId).subscribe({
        next: () => this.fetchApprovedEvents(),
        error: (err) => alert('שגיאה בביטול אישור האירוע')
      });
    }
  }
  selectEvent(event: any) {
    this.selectedEvent = event;
    console.log(event.registered_users.length)

  }
  registerToEvent(eventId?: number): void {
    if (eventId === undefined) {
      console.error('אירוע לא מוגדר');
      return;
    }
    if (confirm('האם אתה בטוח שברצונך להרשם לאירוע?')) {
      this.eventService.registerToEvent(eventId).subscribe({
        next: () => {
          this.fetchApprovedEvents() // קריאה לפונקציה שמביאה מחדש את הנתונים

          alert('רשמת בהצלחה')
        },
        error: (err) => {
          alert('שגיאה ברשמה לאירוע')
          console.log(err)
        }

      });
    }
  }
  unregisterToEvent(eventId?: number): void {
    if (eventId === undefined) {
      console.error('אירוע לא מוגדר');
      return;
    }
    if (confirm('האם אתה בטוח שברצונך לבטל הגעה?')) {
      this.eventService.unregisterToEvent(eventId).subscribe({
        next: () => {
          this.fetchApprovedEvents
          alert('הרישום בוטל בהצלחה')
        },
        error: (err) => {
          alert('שגיאה בביטול הרישום')
          console.log(err)
        }

      });
    }
  }

}
