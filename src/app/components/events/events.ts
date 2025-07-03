import { Component } from '@angular/core';
import { EventListComponent } from '../../event-list/event-list';
import { ApprovedEventsComponent } from '../approved-events/approved-events';

@Component({
  selector: 'app-events',
  imports: [ApprovedEventsComponent,EventListComponent],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {

}
