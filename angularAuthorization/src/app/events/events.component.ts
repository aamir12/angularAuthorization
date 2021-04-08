import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  constructor(private _eventService: EventService) {}

  ngOnInit() {
    this._eventService.getEvents().subscribe(
      (events) => {
        this.events = events;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
