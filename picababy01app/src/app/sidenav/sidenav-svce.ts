import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable()
export class SidenavService {

    private sideNav: MatSidenav;
    constructor() { }

    setSideNav( theSidenav: MatSidenav) {
        this.sideNav = theSidenav;
    }


    close() {
        if( !this.sideNav) {
            return;
        }

        this.sideNav.close();
    }
}
