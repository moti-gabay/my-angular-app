// src/app/sidebar-nav/sidebar-nav.component.ts
import { Component, Input, Output, EventEmitter, HostListener, OnInit, Inject, PLATFORM_ID, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from '../services/auth';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './sidebar-nav.html',
  styleUrls: ['./sidebar-nav.css']
})
export class SidebarNavComponent implements OnInit, AfterViewInit {
  @Input() isLoggedInStatus$: Observable<boolean> | undefined;
  @Input() currentUser$: Observable<UserData | null> | undefined;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  isOpen = false;
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // בדיקה אם רץ בדפדפן
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    // הפעלת בדיקת רוחב חלון רק אם רץ בדפדפן
    if (this.isBrowser) {
      this.updateSidebarState();
      this.cdr.detectChanges(); // מניעת NG0100
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (this.isBrowser) {
      this.updateSidebarState();
    }
  }

  updateSidebarState() {
    // מחשב = פתוח, נייד = סגור
    this.isOpen = window.innerWidth >= 768;
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    console.log('Sidebar toggled. Now:', this.isOpen);
  }

  onLogoutClick(): void {
    this.logout.emit();
  }
}
