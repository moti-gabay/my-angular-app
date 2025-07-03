// src/app/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService, EventRecord } from '../services/event';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth';
import { UserData } from "../services/auth"
import { filter } from 'rxjs';
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
        if (this.currentUser && this.currentUser.role === 'admin') {
          // אם המנהל מחובר - הצג את כל האירועים
          this.events = data;
          console.log(data)
        } else {
          // משתמש רגיל - הצג רק אירועים מאושרים
          this.events = data.filter(event => event.is_approved);
        }
        console.log(this.events)
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
  approveEvent(eventId: number): void {
    if (confirm('האם אתה בטוח שברצונך לאשר את האירוע?')) {
      this.eventService.approveEvent(eventId).subscribe({
        next: () => {
          alert('האירוע אושר בהצלחה.');
          this.fetchEvents(); // רענון הרשימה
        },
        error: (err) => {
          console.error('שגיאה באישור האירוע:', err);
          alert('שגיאה באישור האירוע.');
        }
      });
    }
  }
  unapproveEvent(eventId: number): void {
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


}
