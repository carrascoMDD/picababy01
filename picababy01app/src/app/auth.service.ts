import { Injectable }      from '@angular/core';
import { Router }          from '@angular/router';
import * as auth0          from 'auth0-js';
import { HttpClient }      from '@angular/common/http';

// why do you need defining window as any?
// check this: https://github.com/aws/aws-amplify/issues/678#issuecomment-389106098
( window as any ).global = window;






@Injectable()
export class AuthService {

    auth0: auth0.WebAuth = null;


    constructor( public router: Router, private http: HttpClient ) {
    }


    private getorCreateAuth0(): Promise<auth0.WebAuth> {
        if( this.auth0) {
            return Promise.resolve( this.auth0);
        }

        return new Promise( ( theResolve, theReject) => {
            this.http.get( "/assets/auth.webauth.json").subscribe(
                ( theWebAuthSettings) => {
                    if( !theWebAuthSettings) {
                        console.log( "No auth0 webauth settings retrieved");
                        alert( "No auth0 webauth settings retrieved");
                        return;
                    }

                    this.auth0 = new auth0.WebAuth(
                        {
                            clientID:     theWebAuthSettings[ "clientID"],
                            domain:       theWebAuthSettings[ "domain"],
                            responseType: theWebAuthSettings[ "responseType"],
                            redirectUri:  theWebAuthSettings[ "redirectUri"],
                            scope:        theWebAuthSettings[ "scope"]
                        }
                    );
                    theResolve( this.auth0);
                },
                ( theError) => {
                    console.log( "Error retrieving auth0 webauth settings " + theError);
                    alert( "Error retrieving auth0 webauth settings");
                    theReject();
                }
            )
        });
    }




    public login(): void {
        this.getorCreateAuth0()
            .then(
                ( theAuth0) => {
                    theAuth0.authorize();
                },
                ( theError) => {
                    console.log( "Error getorCreateAuth0 " + theError);
                    alert( "Error getorCreateAuth0");
                }
            );
    }




    public handleAuthentication(): void {
        this.getorCreateAuth0()
            .then(
                ( theAuth0) => {
                    theAuth0.parseHash( ( err, authResult ) => {
                        if( authResult && authResult.accessToken && authResult.idToken ) {
                            window.location.hash = '';
                            this.setSession( authResult );
                            this.router.navigate( [ '/dashboard' ] );
                        }
                        else {
                            if( err ) {
                                this.router.navigate( [ '/' ] );
                                console.log( err );
                            }
                        }
                    } );
                },
                ( theError) => {
                    this.router.navigate( [ '/' ] );
                    console.log( theError );
                }
            );


    }




    private setSession( authResult ): void {
        // Set the time that the Access Token will expire at
        const expiresAt = JSON.stringify( ( authResult.expiresIn * 1000 ) + new Date().getTime() );
        localStorage.setItem( 'access_token', authResult.accessToken );
        localStorage.setItem( 'id_token', authResult.idToken );
        localStorage.setItem( 'expires_at', expiresAt );
    }




    public logout(): void {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem( 'access_token' );
        localStorage.removeItem( 'id_token' );
        localStorage.removeItem( 'expires_at' );
        // Go back to the home route
        this.router.navigate( [ '/' ] );
    }




    public isAuthenticated(): boolean {
        // Check whether the current time is past the
        // Access Token's expiry time
        const expiresAt = JSON.parse( localStorage.getItem( 'expires_at' ) );
        return new Date().getTime() < expiresAt;
    }
}
