import { IPost } from './ipost';

export class Post implements IPost{

    constructor(
        public title: string,
        public category: string,
        public date_posted: Date,
        public position: number,
        public body: string) {
    }


}
