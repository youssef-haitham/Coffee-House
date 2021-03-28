import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router} from '@angular/router';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent{

 @ViewChild('f') signupForm?: NgForm;


 constructor(private authService: AuthService, private router: Router){}

  onSubmit(){
    this.authService.loginUser({username: this.signupForm?.value.username, password: this.signupForm?.value.password});
  }
}
