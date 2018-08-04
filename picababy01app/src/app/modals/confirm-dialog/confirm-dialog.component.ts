import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef }   from '@angular/material';
import { PostService }                     from '../data/post.service';





@Component(
    {
        selector:    'app-confirm-dialog',
        templateUrl: './confirm-dialog.component.html',
        styleUrls:   [ './confirm-dialog.component.css' ]
    } )
export class ConfirmDialogComponent {


    public event: EventEmitter<any> = new EventEmitter();




    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject( MAT_DIALOG_DATA ) public data: Object
    ) {
    }




    onNoClick(): void {
        this.dialogRef.close();
        this.event.emit( false );
    }




    onSubmit(): void {
        this.dialogRef.close();
        this.event.emit( true );
    }


}
