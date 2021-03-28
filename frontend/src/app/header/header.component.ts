import { Component} from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent{

  isLoggedIn = this.authService.isLoggedIn();

  constructor(private authService: AuthService){
  }

  ngOnInit(){
    this.authService.userLoggedIn.subscribe((userLoggedIn: boolean)=>{
      this.isLoggedIn = userLoggedIn;
    });
  }

  logout(){
    this.authService.logout();
  }

}
