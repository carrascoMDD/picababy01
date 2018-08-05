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

import { Terrain01Component} from './terrain01.component';

import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [
    { path: 'terrain01', component: Terrain01Component }
];


describe( 'Terrain01Component', () => {
    let component: Terrain01Component;
    let fixture: ComponentFixture<Terrain01Component>;


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
                    Terrain01Component,
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
                                            declarations: [ Terrain01Component ]
                                        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture   = TestBed.createComponent( Terrain01Component );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
