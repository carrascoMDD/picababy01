import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSidenav }                   from "@angular/material";
import { AuthService }                  from './auth.service';
import { SidenavService }               from "./sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-root',
        templateUrl: './app.component.html',
        styleUrls:   [ './app.component.css' ]
    } )
export class AppComponent implements OnInit {
    title = 'ng6wk01 Playground with Typescript2 and Angular6 without Ionic & Cordova';

    @ViewChild('sidenav') public sideNav:MatSidenav;

    constructor( private sidenavService: SidenavService, public auth: AuthService, private router: Router ) {
        auth.handleAuthentication();

        this.router.events.subscribe(event => {
            console.log( "Route event");
            this.sidenavService.close();
        });
    }

    ngOnInit() {
        this.sidenavService.setSideNav( this.sideNav);
    }


    doLogin() {
        this.sidenavService.close();
        this.auth.login();
    }



    doLogout() {
        this.sidenavService.close();
        this.auth.logout();
    }


    goPath( thePath: string) {
        this.sidenavService.close();
        this.router.navigateByUrl( thePath);
    }
}
