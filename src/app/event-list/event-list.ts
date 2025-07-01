// src/app/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService, EventRecord } from '../services/event';
import { RouterLink } from '@angular/router'; // לייבוא RouterLink לקישורים

@Component({
  selector: 'app-event-list',
  // standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], // הוספת DatePipe
  templateUrl:"./event-list.html",
  styleUrl:"./event-list.css"
})
export class EventListComponent implements OnInit {
  events: EventRecord[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.error = '';
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'שגיאה בטעינת האירועים.';
        this.loading = false;
        console.error('Error fetching events:', err);
      }
    });
  }
}
