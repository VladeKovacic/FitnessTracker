import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user?: User;

    constructor(private router: Router) {}
    
    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        };

        this.authSuccessfully();
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        };

        this.authSuccessfully();
    }

    logout() {
        this.user = undefined;
        this.authChange.next(false);
        this.router.navigate(['/login'])
    }

    getUser() {
        return { ...this.user };
    }

    isAuth() {
        return this.user != undefined;
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }
}