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
        this.approvedEvents = events
        console.log(this.approvedEvents[0].registered_users); // תוודא שזה Array ולא String

        this.cdr.detectChanges(); // מוסיף רענון ידני

      },
      error: (err) => console.error('Error loading approved events', err)
    });
  }

  unapproveEvent(eventId: number): void {
    if (confirm('האם אתה בטוח שברצונך לבטל את אישור האירוע?')) {
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
