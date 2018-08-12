import { Component, OnInit } from '@angular/core';
import { TooledTunnel01 }    from "../../scenes/tooledTunnel01";
import { SidenavService }    from "../../sidenav/sidenav-svce";






@Component(
    {
        selector:    'app-tunneltool01',
        templateUrl: './tunneltool01.component.html',
        styleUrls:   [ './tunneltool01.component.css' ]
    }
)
export class TunnelTool01Component implements OnInit {

    public tunnelTool3D01: TooledTunnel01;

    constructor( private sidenavService: SidenavService) {
        this.tunnelTool3D01 = new TooledTunnel01();
    }



    ngOnInit() {
        this.sidenavService.close();
    }

    ngAfterViewInit() {
        this.tunnelTool3D01.bindToCanvas( 'renderCanvas');
        this.tunnelTool3D01.createScene();

        this.tunnelTool3D01.animate();
    }

    updateScene() {
        if( this.tunnelTool3D01) {
            this.tunnelTool3D01.updateScene();
        }
    }
}
