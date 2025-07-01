// src/app/sidebar-nav/sidebar-nav.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from '../services/auth'; // ייבוא ממשק UserData
import { MatIconModule } from '@angular/material/icon'; // ודא שזה מיובא

@Component({
  selector: 'app-sidebar-nav', // <--- ודא שהסלקטור נכון
  //   standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,


  ],
  templateUrl: './sidebar-nav.html',
  styleUrls: ['./sidebar-nav.css'] // <--- וודא שזה קיים

})
export class SidebarNavComponent {
  // Input properties to receive data from AppComponent
  @Input() isLoggedInStatus$: Observable<boolean> | undefined;
  @Input() currentUser$: Observable<UserData | null> | undefined;
  @Input() isSidebarOpen: boolean = false; // <--- ודא שזה קיים כאן עם @Input()

  // Output events to notify AppComponent
  @Output() logout = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  onLogoutClick(): void {
    this.logout.emit();
  }

  onLinkClick(): void {
    if (this.isSidebarOpen) {
      this.toggleSidebar.emit();
    }
  }
}
