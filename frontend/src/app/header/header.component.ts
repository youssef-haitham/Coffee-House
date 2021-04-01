import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  isAuthenticated = false;
  private userSub: Subscription;
  username: String;

  constructor(private authService: AuthService){
    this.username = "Ahmed";
  }

  ngOnInit(){
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthenticated = !!user;
      if(this.isAuthenticated){
        this.username = user.username.charAt(0).toUpperCase() + user.username.substring(1,user.username.length);
      }
    });
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authService.user.unsubscribe();
  }

}
