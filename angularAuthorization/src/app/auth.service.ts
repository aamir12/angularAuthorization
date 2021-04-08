import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _registerUrl = 'http://localhost:3000/api/register';
  private _loginUrl = 'http://localhost:3000/api/login';
  private _checkEmailUrl = 'http://localhost:3000/api/checkEmailExist';
  constructor(private http: HttpClient, private _router: Router) {}

  registerUser(user) {
    return this.http
      .post<any>(this._registerUrl, user)
      .pipe(catchError(this._handleError));
  }

  loginUser(user) {
    return this.http
      .post<any>(this._loginUrl, user)
      .pipe(catchError(this._handleError));
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/events']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  private _handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error) {
      case 'UserExist':
        errorMessage = 'This email exists already';
        break;
      case 'InvalidEmail':
        errorMessage = 'This email does not exist.';
        break;
      case 'InvalidPassword':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }

  checkEmail(email: string) {
    return this.http.post<boolean>(this._checkEmailUrl, { email });
  }
}
