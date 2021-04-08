import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('f') loginForm: NgForm;
  constructor(private _auth: AuthService, private _router: Router) {}

  errorMessage: string | null = null;
  ngOnInit(): void {}

  login() {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      return;
    }
    this._auth.loginUser(this.loginForm.value).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this._router.navigate(['/special']);
      },
      (err) => (this.errorMessage = err)
    );
  }
}
