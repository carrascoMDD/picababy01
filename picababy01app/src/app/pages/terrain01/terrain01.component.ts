import { Component, OnInit } from '@angular/core';
import { Terrain3D01 }       from "../../scenes/terrain3D01";
import { SidenavService }    from "../../sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-terrain01',
        templateUrl: './terrain01.component.html',
        styleUrls:   [ './terrain01.component.css' ]
    }
)
export class Terrain01Component implements OnInit {

    constructor( private sidenavService: SidenavService) {
    }



    ngOnInit() {
        this.sidenavService.close();
    }

    ngAfterViewInit() {
        let aTerrain3D01 = new Terrain3D01('renderCanvas');
        aTerrain3D01.createScene();

        aTerrain3D01.animate();
    }

}
