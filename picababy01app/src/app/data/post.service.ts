import {Injectable} from '@angular/core';
import {IPost} from '../ipost';
import {Post} from '../post';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/of';

const categories = [
    {value: 'Web-Development', viewValue: 'Web Development'},
    {value: 'Android-Development', viewValue: 'Android Development'},
    {value: 'IOS-Development', viewValue: 'IOS Development'}
];

const LOCALSTORAGEKEY_POSTS = "POSTS";

@Injectable()
export class PostService {

    postsObservable: Observable<IPost[]>;
    postsObserver:   Observer<IPost[]>;
    postsData:       Post[];

    constructor() {
        this.postsObservable = null;
        this.postsData = null;
    }

    getData(): Observable<IPost[]> {
        if( this.postsObservable) {
            return this.postsObservable;
        }

        this.postsObservable = new Observable(( theObserver) => {

            this.postsObserver = theObserver;
            this.updateData();

            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe() {
                    console.log( "PostService getData observable unsubscribe");
                }
            };
        });

        return this.postsObservable;
    }



    updateData() {
        this.postsData = [ ];

        if( !this.postsObserver) {
            return;
        }

        const aPostsStr = localStorage.getItem( LOCALSTORAGEKEY_POSTS);
        if( !aPostsStr) {
            this.postsObserver.next( []);
            return;
        }

        let somePosts = null;
        try {
            somePosts = JSON.parse( aPostsStr);
        }
        catch( anException) {
        }

        if( !somePosts) {
            this.postsObserver.next( []);
            return;
        }

        let somePostsStored = null;
        const aPostsStoredStr = localStorage.getItem( LOCALSTORAGEKEY_POSTS);
        if( aPostsStoredStr) {
            try {
                somePostsStored = JSON.parse( aPostsStr);
            }
            catch( anException) {
            }
        }

        if( somePostsStored) {
            const aNumPostsStored = somePostsStored.length;
            for( let aPostStoredIdx=0; aPostStoredIdx < aNumPostsStored; aPostStoredIdx++) {
                const aPostStored = somePostsStored[ aPostStoredIdx];
                if( !aPostStored) {
                    continue;
                }

                let aPost_date_posed = null;
                const aPostStored_date_posted = aPostStored[ "date_posted"];
                if( aPostStored_date_posted) {
                    try {
                        aPost_date_posed = new Date( aPostStored_date_posted);
                    }
                    catch( anException){
                    }
                }
                const aPost = new Post(
                    aPostStored[ "title"],
                    aPostStored[ "category"],
                    aPost_date_posed,
                    aPostStoredIdx,
                    aPostStored[ "body"]
                );

                this.postsData.push( aPost);
            }
        }

        this.postsObserver.next( this.postsData);
    }





    getCategories() {
        return categories;
    }




    addPost( thePostData: Object) {

        if( !this.postsData) {
            this.postsData = [ ];
        }

        const aNumPosts = this.postsData.length;
        const aPosition = this.nextPostPosition();

        const aPost = new Post(
            thePostData[ "title"],
            thePostData[ "category"],
            new Date(),
            aPosition,
            thePostData[ "body"]
        );


        this.postsData.push( aPost);
        this.storePosts();
        this.updateData();
    }



    private nextPostPosition(): number {

        if( !this.postsData) {
            return 0;
        }

        let aMaxPosition = -1;

        const aNumPosts = this.postsData.length;
        for( var aPostIdx=0; aPostIdx < aNumPosts; aPostIdx++) {
            const aPost = this.postsData[ aPostIdx];
            if( !aPost) {
                continue;
            }

            const aPosition = aPost.position;
            if( !(aPosition === null)) {
                if( aPosition > aMaxPosition) {
                    aMaxPosition = aPosition;
                }
            }
        }

        return aMaxPosition + 1;
    }




    deletePost( theIndex) {
        if( theIndex < 0) {
            return;
        }

        if( !this.postsData) {
            return;
        }

        const aNumPosts = this.postsData.length;
        if( !aNumPosts) {
            return;
        }
        if( theIndex >= aNumPosts) {
            return;
        }

        this.postsData = [...this.postsData.slice(0, theIndex), ...this.postsData.slice(theIndex + 1)];
        this.storePosts();
        this.updateData();

    }


    dataLength() {

        if( !this.postsData) {
            return 0;
        }

        return this.postsData.length;
    }




    private retrievePosts(): Object[] {

        const aPostsStr = localStorage.getItem( LOCALSTORAGEKEY_POSTS);
        if( !aPostsStr) {
            return null;
        }

        let somePosts = null;
        try {
            somePosts = JSON.parse( aPostsStr);
        }
        catch( anException) {
        }

        return somePosts;
    }




    private storePosts() {

        let somePosts = this.postsData;
        if( !somePosts) {
            somePosts = null;
        }

        let aPostsStr: string = null;
        try {
            aPostsStr = JSON.stringify( somePosts);
        }
        catch( anException) {
            throw anException;
        }

        localStorage.setItem( LOCALSTORAGEKEY_POSTS, aPostsStr);
    }




    retrievePostsO() : Observable<Object[]>  {

        console.log( "ActiveFilter getAllApplicationsKeyed");

        return new Observable<Object[]>(( theObserver) => {

            const aPostsStr = localStorage.getItem( LOCALSTORAGEKEY_POSTS);
            if( !aPostsStr) {
                theObserver.next( []);
                theObserver.complete();
                return;
            }

            let somePosts = null;
            try {
                somePosts = JSON.parse( aPostsStr);
            }
            catch( anException) {
            }

            if( !somePosts) {
                theObserver.next( []);
                theObserver.complete();
                return;
            }

            theObserver.next( somePosts);

            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe() {
                    console.log( "TemplatesFilter getTemplatespecs observable unsubscribe");
                }
            };
        });

    }


}
