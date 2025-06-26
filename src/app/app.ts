// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../app/services/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  template: `
    <nav class="bg-gray-800 p-4  flex justify-between items-center">
      <a routerLink="/files" class="text-xl font-bold">מערכת ניהול</a>
      <div>
        <ng-container *ngIf="authService.isLoggedIn$ | async as isLoggedInStatus">
          <ng-container *ngIf="authService.currentUser$ | async as user">
            <!-- קישורי ניווט לפי תפקיד -->
            <a *ngIf="user.role === 'admin' || user.role === 'member'" routerLink="/files" class="mr-4 hover:text-gray-300">ניהול קבצים</a>
            <a *ngIf="user.role === 'user'" routerLink="/dashboard" class="mr-4 hover:text-gray-300">לוח בקרה אישי</a>
            
            <button *ngIf="isLoggedInStatus" (click)="authService.logout()" class="bg-red-500 hover:bg-red-700  font-bold py-1 px-3 rounded-full text-sm">התנתק</button>
          </ng-container>
          
          <a *ngIf="!isLoggedInStatus" routerLink="/login" class="bg-blue-500 hover:bg-blue-700  font-bold py-1 px-3 rounded-full text-sm">התחבר / הירשם</a>
        </ng-container>
      </div>
    </nav>
    <main class="p-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit {
  title = 'file-manager-app';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // ניתן להירשם לשינויי משתמש כאן אם יש לוגיקה כללית שצריכה להגיב לשינויי תפקיד
  }
}
