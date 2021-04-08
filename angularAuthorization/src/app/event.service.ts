import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private _eventsUrl = 'http://localhost:3000/api/events';
  private _specialEventsUrl = 'http://localhost:3000/api/special';

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get<any>(this._eventsUrl);
  }

  getSpecialEvents() {
    return this.http
      .get<any>(this._specialEventsUrl)
      .pipe(catchError(this._handleError));
  }

  private _handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Unknown Error';
    if (!errorRes.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error) {
      case 'UnauthReq':
        errorMessage = 'Unauthorized user';
        break;
    }
    return throwError(errorMessage);
  }
}
