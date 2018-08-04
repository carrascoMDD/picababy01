import { Component, OnInit } from '@angular/core';
import { PostService }       from '../../data/post.service';
import { Post }              from '../../post';
import { DataSource }        from '@angular/cdk/table';
import { Observable }        from 'rxjs/Observable';
import { AuthService }       from '../../auth.service';
import { MatDialog }         from '@angular/material';

import { PostDialogComponent }     from '../../modals/post-dialog/post-dialog.component';
import { MustloginAlertComponent } from '../../modals/mustlogin-alert/mustlogin-alert.component';
import { ConfirmDialogComponent }  from '../../modals/confirm-dialog/confirm-dialog.component';
import { SidenavService }          from "../../sidenav/sidenav-svce";


const LOG = true;






@Component(
    {
        selector:    'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls:   [ './dashboard.component.css' ]
    }
)
export class DashboardComponent implements OnInit {

    constructor(
        private sidenavService: SidenavService,
        private dataService: PostService,
        public auth: AuthService,
        public dialog: MatDialog ) {
    }


    ngOnInit() {
        this.sidenavService.close();
    }


    displayedColumns = [ 'date_posted', 'title', 'category', 'delete' ];
    dataSource       = new PostDataSource( this.dataService );




    deletePost( id ) {
        return new Promise( ( theResolve, theReject) => {
            if( this.auth.isAuthenticated() ) {
                this.openConfirmDeleteAlert( "Do you really want to delete post ?")
                    .then(
                        ( theOK) => {
                            return  this.dataService.deletePost( id );
                        },
                        ( theError) => {
                            throw theError;
                        }
                    )
                    .then(
                        () => {
                            theResolve();
                        },
                        ( theError) => {
                            theReject( theError);
                        }
                    );
            }
            else {
                this.openMustLoginAlert("Login Before deleting posts" )
                    .then(
                        () => {
                            theResolve();
                        },
                        ( theError) => {
                            theReject( theError);
                        }
                    );
            }

        });


    }




    openMustLoginAlert( theMessage: string ): Promise<void> {
        if( LOG ) {
            console.log( "DashboardComponent.openMustLoginAlert() BEGIN" );
        }
        let dialogRef = this.dialog.open( MustloginAlertComponent, {
            width: '600px',
            data:  theMessage
        } );

        return new Promise( ( theResolve, theReject ) => {
            dialogRef.componentInstance.event.subscribe(
                ( theOK ) => {
                    if( LOG ) {
                        console.log( "DashboardComponent.openMustLoginAlert() OK" );
                    }

                    if( theOK) {
                        this.auth.login();
                    }

                    theResolve();
                },
                ( theError ) => {
                    if( LOG ) {
                        console.log( "DashboardComponent.openMustLoginAlert() ERROR " + theError );
                    }

                    theReject( theError );
                } );
        } );
    }



    openConfirmDeleteAlert( theMessage: string ): Promise<void> {
        if( LOG ) {
            console.log( "DashboardComponent.openConfirmDeleteAlert() BEGIN" );
        }
        let dialogRef = this.dialog.open( ConfirmDialogComponent, {
            width: '600px',
            data:  theMessage
        } );

        return new Promise( ( theResolve, theReject ) => {
            dialogRef.componentInstance.event.subscribe(
                ( theOK ) => {
                    if( LOG ) {
                        console.log( "DashboardComponent.openConfirmDeleteAlert() OK" );
                    }

                    if( theOK) {
                        theResolve();
                    }
                    else {
                        theReject();
                    }
                },
                ( theError ) => {
                    if( LOG ) {
                        console.log( "DashboardComponent.openConfirmDeleteAlert() ERROR " + theError );
                    }

                    theReject( theError );
                } );
        } );
    }




    openAddPostDialog(): void {
        let dialogRef = this.dialog.open( PostDialogComponent, {
            width: '600px',
            data:  'Add Post'
        } );
        dialogRef.componentInstance.event.subscribe( ( result ) => {
            this.dataService.addPost( result.data );
            // this.dataSource = new PostDataSource(this.dataService);
        } );
    }


}






export class PostDataSource extends DataSource<any> {
    constructor( private PostService: PostService ) {
        super();
    }




    connect(): Observable<Post[]> {
        return this.PostService.getData();
    }




    disconnect() {
    }
}
