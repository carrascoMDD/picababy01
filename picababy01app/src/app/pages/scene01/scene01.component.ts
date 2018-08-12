import { Component, OnInit } from '@angular/core';
import { Ball01 }            from "../../scenes/ball01";
import { SidenavService }    from "../../sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-scene01',
        templateUrl: './scene01.component.html',
        styleUrls:   [ './scene01.component.css' ]
    }
)
export class Scene01Component implements OnInit {

    constructor( private sidenavService: SidenavService) {
    }



    ngOnInit() {
        this.sidenavService.close();
    }

    ngAfterViewInit() {
        const aBall3D = new Ball01('renderCanvas');
        aBall3D.createScene();

        aBall3D.animate();
    }

}
