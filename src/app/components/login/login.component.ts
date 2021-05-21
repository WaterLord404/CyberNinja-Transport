import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackBarService } from 'src/app/core/services/snack-bar.service';
import { UserI } from '../../interfaces/userI';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Loguea al usuario en el sistema
   */
  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      this.snackBarService.popup(300);
      return;
    }

    const user: UserI = this.createUser();

    this.userService.login(user).subscribe(
      res => this.resolveRequest(res),
      err => this.rejectRequest(err)
    );
  }

  /**
   * Crea el usuario para enviarlo al servicio de login
   */
  createUser(): UserI {
    return {
      username: this.f.username.value,
      password: this.f.password.value
    };
  }

  resolveRequest(res: any): void {
    // Guarda el jwt
    this.authService.login(res.headers.get('Authorization'));
    this.router.navigate(['/']);
    this.snackBarService.popup(210);
  }

  rejectRequest(err: any): void {
    switch (err.status) {
      case 500:
        this.snackBarService.popup(500);
        break;
      default:
        this.snackBarService.popup(301);
        break;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
}
