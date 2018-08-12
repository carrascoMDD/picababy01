import { Component, OnInit } from '@angular/core';
import { Cava01 }       from "../../scenes/cava01";
import { SidenavService }    from "../../sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-cava01',
        templateUrl: './cava01.component.html',
        styleUrls:   [ './cava01.component.css' ]
    }
)
export class Cava01Component implements OnInit {

    constructor( private sidenavService: SidenavService) {
    }



    ngOnInit() {
        this.sidenavService.close();
    }

    ngAfterViewInit() {
        const aCava3D01 = new Cava01('renderCanvas');
        aCava3D01.createScene();

        aCava3D01.animate();
    }

}
