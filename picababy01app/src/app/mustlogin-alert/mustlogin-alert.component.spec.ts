import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
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
import { FormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';


import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes }    from "@angular/router";
import { DashboardComponent }      from "../dashboard/dashboard.component";
import { PostService }             from "../data/post.service";
import { SidenavService }          from "../sidenav/sidenav-svce";
import { WelcomeComponent }        from "../welcome/welcome.component";

import { APP_BASE_HREF } from '@angular/common';

import { MustloginAlertComponent } from './mustlogin-alert.component';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialog,  MatDialogRef} from "@angular/material/dialog";



const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'dashboard', component: DashboardComponent }
];


describe('PostDialogComponent', () => {
  let component: MustloginAlertComponent;
  let fixture: ComponentFixture<MustloginAlertComponent>;


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
                    MustloginAlertComponent,
                    WelcomeComponent,
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

    beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MustloginAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( MustloginAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
