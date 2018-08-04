import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef }   from '@angular/material';
import { PostService }                     from '../data/post.service';






@Component(
    {
        selector:    'app-mustlogin-alert',
        templateUrl: './mustlogin-alert.component.html',
        styleUrls:   [ './mustlogin-alert.component.css' ]
    } )
export class MustloginAlertComponent {


    public event: EventEmitter<any> = new EventEmitter();




    constructor(
        public dialogRef: MatDialogRef<MustloginAlertComponent>,
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
