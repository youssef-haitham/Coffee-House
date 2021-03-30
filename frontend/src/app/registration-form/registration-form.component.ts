import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent{

  @ViewChild('f') signupForm?: NgForm;
  @ViewChildren('location') linkRefs?: QueryList<NgModel>;

  indexes = [0]
  counter = 1;
  signedUp = false;
  isLoading = false;
  error?: string;
  

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router){}

  onSubmit(){
    this.isLoading = true;
    var username = this.signupForm?.value.username;
    var email = this.signupForm?.value.email;
    var locations: String[] = [];
    if(this.linkRefs?.toArray != null){
      for(let i =0; i<this.linkRefs?.toArray().length;i++){
        locations.push(this.linkRefs?.toArray()[i].viewModel);
      }
    }
    this.authService.registerUser({username: username, password: this.signupForm?.value.password,email: email, locations: locations}).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['login']);
      },
      (err) => {
        this.error = err;
        this.isLoading = false;
      }
    );
  }

  plusLocation(){
    this.indexes.push(this.counter);
    this.counter++;
  }

  removeLocation(index: any){
    if(this.counter==1){
      alert("Can't remove more locations");
    }
    else{
      this.counter--;
      this.indexes.splice(index,1);
    }
    
  }
  
}
