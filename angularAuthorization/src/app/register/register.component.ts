import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  errorMessage: string | null = null;
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private fb: FormBuilder
  ) {}
  signFrm: FormGroup;
  ngOnInit() {
    this.signFrm = this.fb.group({
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        [this.asyncEmailValidator()]
      ),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  get f() {
    return this.signFrm.controls;
  }

  register() {
    this.errorMessage = null;

    console.log(this.signFrm.get('email').errors);

    if (this.signFrm.invalid) {
      this.validateAllFormFields(this.signFrm);
      //alert(0);
    } else {
      //alert(1);
      this._auth.registerUser(this.signFrm.value).subscribe(
        (res) => {
          localStorage.setItem('token', res.token);
          this._router.navigate(['/special']);
        },
        (err) => (this.errorMessage = err)
      );
    }
  }

  asyncEmailValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Observable<ValidationErrors | null>
      | Promise<ValidationErrors | null> => {
      const value = control.value;

      if (control.errors && !control.errors.emailTaken) {
        return of(null);
      }

      return this._auth.checkEmail(value).pipe(
        debounceTime(500),
        map((emailExist: boolean) => {
          console.log(emailExist);
          if (emailExist) {
            return {
              emailTaken: true,
            };
          }
          return null;
        })
      );
    };
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      console.log(control);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
