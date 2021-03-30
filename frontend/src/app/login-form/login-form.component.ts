import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  @ViewChild('f') signupForm?: NgForm;
  isLoading = false;
  error?: string;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.signupForm?.valid) {
      return;
    }
    this.isLoading = true;
    this.authService.loginUser({ email: this.signupForm?.value.email, password: this.signupForm?.value.password }).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['home']);
      },
    (err)=>{
      this.error = err;
      this.isLoading = false;
    });
  }
}
