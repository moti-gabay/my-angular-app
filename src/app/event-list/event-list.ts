// src/app/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService, EventRecord } from '../services/event';
import { RouterLink } from '@angular/router'; // לייבוא RouterLink לקישורים

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], // הוספת DatePipe
  template: `
    <div class="container mt-8 p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto font-inter">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">אירועים קרובים</h2>

      <div *ngIf="loading" class="text-center text-gray-600">טוען אירועים...</div>
      <div *ngIf="error" class="text-center text-red-500 mb-4">{{ error }}</div>

      <div *ngIf="events.length > 0" class="space-y-4">
        <div *ngFor="let event of events" 
             class="bg-blue-50 p-4 rounded-lg border border-blue-200 hover:bg-blue-100 transition duration-200 ease-in-out">
          <h3 class="text-xl font-semibold text-blue-800">{{ event.title }}</h3>
          <p class="text-gray-700 text-sm mt-1">
            <span class="font-medium">תאריך:</span> {{ event.date | date:'medium' }}
          </p>
          <p *ngIf="event.location" class="text-gray-700 text-sm">
            <span class="font-medium">מיקום:</span> {{ event.location }}
          </p>
          <p class="text-gray-600 mt-2 text-justify line-clamp-3">{{ event.description }}</p>
          
          <div class="mt-3 text-right">
            <!-- קישור לצפייה בפרטים המלאים (אם תבנה קומפוננטת פרטי אירוע) -->
            <a [routerLink]="['/events', event.id]" 
               class="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition duration-200">
               צפה בפרטים
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && events.length === 0" class="text-center text-gray-500 p-4">
        אין אירועים קרובים להצגה.
      </div>
    </div>
  `
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
