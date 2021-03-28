import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../model/userModel';

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
  signedUp:Boolean = false;

  

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router){
    
  }

  onSubmit(){
    var username = this.signupForm?.value.username;
    var email = this.signupForm?.value.email;
    var locations: String[] = [];
    if(this.linkRefs?.toArray != null){
      for(let i =0; i<this.linkRefs?.toArray().length;i++){
        locations.push(this.linkRefs?.toArray()[i].viewModel);
      }
    }
    let newUser = new UserModel(username,this.signupForm?.value.password,email,locations);
    this.authService.registerUser(newUser).subscribe(
      (res) => {

      },
      (err) => {
        
      }
    );
    // this.router.navigate(['login']);
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
