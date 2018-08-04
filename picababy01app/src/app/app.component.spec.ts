import { TestBed, async } from '@angular/core/testing';
import { AppComponent }   from './app.component';

import {
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule
} from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule,  Routes } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';


import { AuthService }        from './auth.service';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SidenavService }     from "./sidenav/sidenav-svce";
import { WelcomeComponent }   from "./pages/welcome/welcome.component";


const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'dashboard', component: DashboardComponent }
];



describe( 'AppComponent', () => {
    beforeEach( async( () => {
        TestBed.configureTestingModule(
            {
                imports:      [
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
                    BrowserAnimationsModule,
                    RouterModule.forRoot( routes )
                ],
                declarations: [
                    AppComponent,
                    DashboardComponent,
                    WelcomeComponent
                ],
                providers:    [
                    AuthService,
                    SidenavService,
                    { provide: APP_BASE_HREF, useValue: '/' }
                ]
            } ).compileComponents();
    } ) );
    it( 'should create the app', async( () => {
        const fixture = TestBed.createComponent( AppComponent );
        const app     = fixture.debugElement.componentInstance;
        expect( app ).toBeTruthy();
    } ) );
    it( `should have as title 'ng6wk01 Playground with Typescript2 and Angular6 without Ionic & Cordova'`, async( () => {
        const fixture = TestBed.createComponent( AppComponent );
        const app     = fixture.debugElement.componentInstance;
        expect( app.title ).toEqual( 'ng6wk01 Playground with Typescript2 and Angular6 without Ionic & Cordova' );
    } ) );
    /* Why a non UI karma test is trying to assert DOM ?
    it( 'should render title in a h1 tag', async( () => {
        const fixture = TestBed.createComponent( AppComponent );
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect( compiled.querySelector( 'h1' ).textContent ).toContain( 'ng6wk01 Welcome' );
    } ) );
    */
} );
