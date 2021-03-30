import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../environments/environment';
import * as moment from "moment";
import { User } from '../model/userModel';
import { BehaviorSubject, throwError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, tap } from "rxjs/operators";


@Injectable()
export class AuthService {

    user = new BehaviorSubject<User>(null);
    currentUser: User;

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

    registerUser(json: { username: String, password: String, email: String, locations: Array<String> }) {
        return this.http.post(environment.apiUrl + 'signUp', json, { observe: 'response' }).pipe(catchError((err) => {
            return this.handleError(err);
        }));
    }

    loginUser(userData: { email: String, password: String }) {
        return this.http.post<Object>(environment.apiUrl + 'signIn', userData, { observe: 'response' }).pipe(catchError((err) => {
            return this.handleError(err);
        }), tap((res: any) => {
            if (res.status == 200) {
                this.setSession(res.body.data);
            }
        }));
    }



    private setSession(authResult: any) {
        const expiresAt = moment().add(authResult.exp - authResult.iat, 'second');
        this.currentUser = new User(authResult.id, authResult.token, authResult.username);
        localStorage.setItem("current_user", JSON.stringify(authResult));
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
        this.user.next(authResult);
    }

    public logout() {
        localStorage.removeItem("current_user");
        localStorage.removeItem("expires_at");
        this.user.next(undefined);
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

    private handleError(err:HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!'
        if (err.error.msg != null) errorMessage = err.error.msg;
        return throwError(errorMessage);
    }
}