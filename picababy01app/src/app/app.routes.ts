import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Scene01Component }     from "./scene01/scene01.component";
import { WelcomeComponent }     from './welcome/welcome.component';
import { DashboardComponent }   from './dashboard/dashboard.component';


const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'scene01', component: Scene01Component}
];






@NgModule(
    {
        imports: [ RouterModule.forRoot( routes ) ],
        exports: [ RouterModule ]
    } )
export class AppRouters {}
