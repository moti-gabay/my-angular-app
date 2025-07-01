// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav'; // ייבוא הקומפוננטה החדשה

@Component({
  selector: 'app-root',
  // standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarNavComponent // הוספת הקומפוננטה החדשה לייבוא
  ],
  templateUrl:"./app.html",
  styleUrl:"./app.css"
})
export class AppComponent implements OnInit {
  title = 'file-manager-app';
  isSidebarOpen: boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // מצב ההתחברות מטופל על ידי AuthService והוא אסינכרוני
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onLogout(): void {
    this.authService.logout().subscribe(); // הפעל את פונקציית ההתנתקות משירות האימות
  }
}
