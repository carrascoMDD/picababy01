import { APP_BASE_HREF }                    from "@angular/common";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
}                                  from '@angular/material';
import { RouterModule,  Routes } from '@angular/router';

import { AuthService }      from "../../auth.service";
import { SidenavService }   from "../../sidenav/sidenav-svce";
import { WelcomeComponent } from "../welcome/welcome.component";


import { DashboardComponent } from './dashboard.component';

import { PostService } from '../../data/post.service';

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'dashboard', component: DashboardComponent }
];


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

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
                    RouterModule.forRoot( routes )
                ],
                declarations: [
                    DashboardComponent,
                    WelcomeComponent
                ],
                providers:    [
                    AuthService,
                    SidenavService,
                    { provide: APP_BASE_HREF, useValue: '/' },
                    PostService
                ],
            } ).compileComponents();
    } ) );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
