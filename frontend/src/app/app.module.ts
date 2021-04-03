import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import {HeaderComponent} from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthGaurdService } from './services/auth.gaurd.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    HeaderComponent,
    HomeComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
    ],
  providers: [AuthService,AuthGaurdService],
  bootstrap: [AppComponent]
})
export class AppModule {}
