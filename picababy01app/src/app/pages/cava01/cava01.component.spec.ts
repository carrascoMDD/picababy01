import { async, ComponentFixture, TestBed }                                                                                                  from '@angular/core/testing';
import { FormsModule }                                                                                                                       from "@angular/forms";
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule
}                                                         from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule }      from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes }    from "@angular/router";
import { DashboardComponent }      from "../dashboard/dashboard.component";
import { PostService }             from "../../data/post.service";
import { PostDialogComponent }     from "../../modals/post-dialog/post-dialog.component";
import { SidenavService }          from "../../sidenav/sidenav-svce";

import { Cava01Component} from './cava01.component';

import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [
    { path: 'cava01', component: Cava01Component }
];


describe( 'Cava01Component', () => {
    let component: Cava01Component;
    let fixture: ComponentFixture<Cava01Component>;


    beforeEach( async( () => {
        TestBed.configureTestingModule(
            {
                imports:      [
                    FormsModule,
                    MatDialogModule,
                    MatSidenavModule,
                    MatToolbarModule,
                    MatIconModule,
                    MatListModule,
                    MatInputModule,
                    MatButtonModule,
                    MatSelectModule,
                    MatCardModule,
                    MatTableModule,
                    MatFormFieldModule,
                    BrowserAnimationsModule,
                    RouterModule.forRoot( routes )
                ],
                declarations: [
                    PostDialogComponent,
                    Cava01Component,
                    DashboardComponent
                ],
                providers:    [
                    PostService,
                    SidenavService,
                    { provide: APP_BASE_HREF, useValue: '/' },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: MAT_DIALOG_DATA, useValue: [] },
                ],
            } ).compileComponents();
    } ) );

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
                                            declarations: [ Cava01Component ]
                                        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture   = TestBed.createComponent( Cava01Component );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
