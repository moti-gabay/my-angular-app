// src/app/user-dashboard/user-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Observable } from 'rxjs';
import { ImageGalleryComponent } from '../../image-gallery/image-gallery';
import { EventListComponent } from '../../event-list/event-list';

@Component({
  selector: 'app-user-dashboard',
  // standalone: true,
  imports: [CommonModule,ImageGalleryComponent,EventListComponent],
  templateUrl:"./user-dashbord.html",
  styleUrls: ['./user-dashbord.css']

})
export class UserDashboardComponent implements OnInit {
  currentUser$: Observable<any | null>;

  constructor(public authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
  }
}
