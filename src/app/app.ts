// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav'; // ייבוא הקומפוננטה החדשה
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Footer } from './components/footer/footer';
import { ContactComponent } from './components/contact/contact';
import { f } from "../../node_modules/@angular/material/icon-module.d-COXCrhrh";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Footer,
    SidebarNavComponent,
    MatIconModule // הוספת MatIconModule

  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
  animations: [
    trigger('sidebarAnimation', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out')
      ]),
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'file-manager-app';

  // מתודה לפתיחה/סגירה של הסיידבאר


  // מתודה המופעלת כאשר הסיידבאר נסגר (לדוגמה, בלחיצה על קישור)
 
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    // מצב ההתחברות מטופל על ידי AuthService והוא אסינכרוני
  }

  

  onLogout(): void {
    this.authService.logout().subscribe(); // הפעל את פונקציית ההתנתקות משירות האימות
  }
}
