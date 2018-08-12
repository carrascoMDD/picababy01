import { Component, OnInit } from '@angular/core';
import { Maze01 }       from "../../scenes/maze01";
import { SidenavService }    from "../../sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-maze01',
        templateUrl: './maze01.component.html',
        styleUrls:   [ './maze01.component.css' ]
    }
)
export class Maze01Component implements OnInit {

    constructor( private sidenavService: SidenavService) {
    }



    ngOnInit() {
        this.sidenavService.close();
    }

    ngAfterViewInit() {
        const aMaze3D01 = new Maze01('renderCanvas');
        aMaze3D01.createScene();

        aMaze3D01.animate();
    }

}
