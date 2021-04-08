import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') registerForm: NgForm;
  errorMessage: string | null = null;
  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  register() {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      return;
    }
    this._auth.registerUser(this.registerForm.value).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this._router.navigate(['/special']);
      },
      (err) => (this.errorMessage = err)
    );
  }
}
