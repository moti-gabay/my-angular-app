// src/app/components/home.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container mt-4">
      <h1 class="text-primary">ברוכים הבאים ל-Angular עם Bootstrap וסטנדאלון קומפוננטות!</h1>
      <button class="btn btn-success">לחץ כאן</button>
    </div>
  `
})
export class Home {}
