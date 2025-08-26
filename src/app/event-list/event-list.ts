// src/app/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService, EventRecord, ApprovedEventEmailData } from '../services/event';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth';
import { UserData } from "../services/auth"
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
@Component({
  selector: 'app-event-list',
  // standalone: true,
  imports: [CommonModule, DatePipe], // הוספת DatePipe
  templateUrl: "./event-list.html",
  styleUrl: "./event-list.css"
})
export class EventListComponent implements OnInit {
  events: EventRecord[] = [];
  loading: boolean = true;
  error: string = '';
  currentUser: UserData | null = null;
  // או 'admin'

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      filter((user): user is UserData => user !== null)
    ).subscribe(user => {
      this.currentUser = user;
      this.fetchEvents();
    });
  }

  fetchEvents(): void {
    this.loading = true;
    this.error = '';
    this.eventService.getEvents().subscribe({
      next: (data) => {
        const now = new Date();

        if (this.currentUser && this.currentUser.role === 'admin') {
          // אם המנהל מחובר - הצג את כל האירועים
          this.events = data;
          console.log(data)
        } else {
          // משתמש רגיל - הצג רק אירועים מאושרים
          this.events = data.filter(event =>
            event.is_approved &&
            event.date && // תוודא שהתאריך קיים
            new Date(event.date) >= now
          );
        }
        this.loading = false;
        this.cdr.detectChanges(); // מוסיף רענון ידני

      },
      error: (err) => {
        this.error = err.error?.message || 'שגיאה בטעינת האירועים.';
        this.loading = false;
        console.error('Error fetching events:', err);
      }
    });
  }
  approveEvent(eventId: string, event: EventRecord): void {
    console.log("eventId : " ,eventId)
    if (confirm('האם אתה בטוח שברצונך לאשר את האירוע?')) {
      this.eventService.approveEvent(eventId).subscribe({
        next: () => {
          alert('האירוע אושר בהצלחה.');
          this.fetchEvents(); // רענון הרשימה

          // שליחת מייל ליוצר האירוע אם קיים
          if (event.created_by) {
            this.authService.getAllUsers().pipe(
              take(1),
              switchMap(allUsers => {
                // console.log("allUsers", allUsers); // תוודא כאן אם זה אובייקט או מערך
                const usersArray = Array.isArray(allUsers) ? allUsers : Object.values(allUsers);
                const creatorUser = usersArray.find(user => user.id === event.created_by);

                if (!creatorUser) {
                  throw new Error('לא נמצא יוצר האירוע');
                }

                const fullEvent: ApprovedEventEmailData = {
                  recipient_email: creatorUser.email,
                  event_title: event.title,
                  event_date: event.date,
                  event_time: event.time,
                  event_location: event.location,
                  creator_name: creatorUser.name
                };

                return this.eventService.sendMailToCreatorEvent(fullEvent);
              }),
              catchError(err => {
                console.error('שגיאה בשליפת יוצר האירוע או שליחת מייל:', err);
                return throwError(() => new Error('שליחת מייל נכשלה'));
              })
            ).subscribe({
              next: () => {
                // console.log('המייל נשלח בהצלחה.');
              },
              error: (err) => {
                console.error('שגיאה בשליחת המייל:', err);
              }
            });
          }

        },
        error: (err) => {
          console.error('שגיאה באישור האירוע:', err);
          alert('שגיאה באישור האירוע.');
        }
      });
    }
  }

  unapproveEvent(eventId: string): void {
    if (confirm('האם אתה בטוח שברצונך לבטל את אישור האירוע?')) {
      this.eventService.unapproveEvent(eventId).subscribe({
        next: () => {
          this.fetchEvents(); // רענון הרשימה אחרי שינוי
        },
        error: (err) => {
          console.error('שגיאה בביטול אישור האירוע:', err);
          alert('שגיאה בביטול אישור האירוע.');
        }
      });
    }
  }

  deleteEvent(eventId: string): void {
    if (confirm("אתה בטוח שברצונך למחוק את האירוע?")) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.fetchEvents()
        },
        error: (err) => {
          console.log("אירעה שגיאה בזמן מחיקת האירוע", err);
          alert("אירעה שגיאה בזמן מחיקת האירוע")
        }
      })
    }
  }
}
