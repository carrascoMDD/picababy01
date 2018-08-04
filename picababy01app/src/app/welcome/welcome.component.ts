import { Component, OnInit } from '@angular/core';
import { SidenavService }    from "../sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-welcome',
        templateUrl: './welcome.component.html',
        styleUrls:   [ './welcome.component.css' ]
    }
)
export class WelcomeComponent implements OnInit {

    constructor( private sidenavService: SidenavService) {
    }



    ngOnInit() {
        this.sidenavService.close();
    }

}
