import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurdService implements CanActivate {

    constructor(private authService: AuthService,private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            map(user => {
            const isAuth = !!user;
            if(isAuth){
                return this.router.createUrlTree(['home']);
            }
            return true;
        }))
        
    }
    }
