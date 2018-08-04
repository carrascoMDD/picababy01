import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent }            from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule }            from '@angular/cdk/layout';
import { FlexLayoutModule }        from '@angular/flex-layout';
import { FormsModule }             from '@angular/forms';

import 'hammerjs';
import { SidenavService }          from "./sidenav/sidenav-svce";
import { WelcomeComponent }        from './pages/welcome/welcome.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { Scene01Component }        from './pages/scene01/scene01.component';

import { MaterialModule } from './material.module';
import { AppRouters }     from './app.routes';

import { PostService }             from './data/post.service';
import { AuthService }             from './auth.service';
import { PostDialogComponent }     from './modals/post-dialog/post-dialog.component';
import { MustloginAlertComponent } from './modals/mustlogin-alert/mustlogin-alert.component';
import { ConfirmDialogComponent }  from "./modals/confirm-dialog/confirm-dialog.component";




@NgModule(
    {
        declarations:    [
            AppComponent,
            WelcomeComponent,
            DashboardComponent,
            Scene01Component,
            PostDialogComponent,
            MustloginAlertComponent,
            ConfirmDialogComponent
        ],
        imports:         [
            HttpClientModule,
            BrowserModule,
            BrowserAnimationsModule,
            LayoutModule,
            MaterialModule,
            FlexLayoutModule,
            FormsModule,
            AppRouters
        ],
        providers:       [ PostService, AuthService, SidenavService ],
        bootstrap:       [ AppComponent ],
        entryComponents: [
            PostDialogComponent,
            MustloginAlertComponent,
            ConfirmDialogComponent
        ]
    } )
export class AppModule {}
