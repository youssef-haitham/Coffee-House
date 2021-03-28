import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../environments/environment';
import * as moment from "moment";
import { UserModel } from '../model/userModel';
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class AuthService {

    userLoggedIn = new Subject<boolean>();

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { 

     this.userLoggedIn.next(this.isLoggedIn());
     
    }

    registerUser(json: UserModel) {
        return this.http.post(environment.apiUrl + 'signUp', json, { observe: 'response' });
    }

    async loginUser(userData: { username: String, password: String }){
        await this.http.post(environment.apiUrl + 'signIn', userData, { observe: 'response' }).subscribe(
            (res: any) => {
                if (res.status == 200) {
                    this.setSession(res.body.data);
                    this.userLoggedIn.next(true);
                    alert("WELCOME BACK " + userData.username.toUpperCase() + "!");
                }
                else{
                    this.userLoggedIn.next(false);
                    alert("An error happened");
                }
            },
            (err) => {
                this.userLoggedIn.next(false);
                alert(err.error.msg);
            }
        );
    }



    private setSession(authResult: any) {
        const expiresAt = moment().add(authResult.exp - authResult.iat, 'second');
        localStorage.setItem('id_token', authResult.id + "");
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    }

    public logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        this.userLoggedIn.next(false);
        this.router.navigate(['home']);
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    private getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        if (expiration != null) {
            const expiresAt = JSON.parse(expiration);
            return moment(expiresAt);
        }
        return null;
    }
}