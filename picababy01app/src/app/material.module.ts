import { NgModule }      from '@angular/core';

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

import 'hammerjs';


@NgModule(
    {
        imports: [
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
        ],
        exports: [
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
        ]
    } )
export class MaterialModule {}
