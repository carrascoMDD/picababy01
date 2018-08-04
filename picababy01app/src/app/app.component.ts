import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Ball01 } from './scenes/ball01';


declare var babylonjs;

@Component({
             selector: 'app-root',
             templateUrl: './app.component.html',
             styleUrls: ['./app.component.css']
           })
export class AppComponent implements AfterViewInit{
  title = 'app';

  ngAfterViewInit() {
    let game = new Ball01('renderCanvas');
    game.createScene();

    game.animate();
  }
}
