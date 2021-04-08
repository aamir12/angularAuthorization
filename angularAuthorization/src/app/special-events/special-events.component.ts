import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.css'],
})
export class SpecialEventsComponent implements OnInit {
  specialEvents = [];

  constructor(private _eventService: EventService, private _router: Router) {}

  errorMessage: string | null;
  ngOnInit() {
    this._eventService.getSpecialEvents().subscribe(
      (res) => (this.specialEvents = res),
      (err) => {
        this.errorMessage = err;
      }
    );
  }
}
