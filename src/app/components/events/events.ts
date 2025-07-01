import { Component } from '@angular/core';
import { EventListComponent } from '../../event-list/event-list';

@Component({
  selector: 'app-events',
  imports: [EventListComponent],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {

}
