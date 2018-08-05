import {
    Engine, Scene, FreeCamera, Light,
    Vector3, HemisphericLight, MeshBuilder
} from 'babylonjs';

import { Terrain3D01Coords } from "./terrain01coords"
import Polygon = BABYLON.Polygon;
import Mesh = BABYLON.Mesh;



const SUBSTRACTFROM_X=713250;
const SUBSTRACTFROM_Y=4361200;
const FIXEDZ=0;



export class Terrain3D01 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _light: Light;
    private _parcelasFlat: Polygon;
    private _parcelasExtruded: Mesh;




    constructor( canvasElement: string ) {
        this._canvas = <HTMLCanvasElement>document.getElementById( canvasElement );
        this._engine = new Engine( this._canvas, true );
    }



    coordsAsVector3(): Vector3[] {

        let someVector3 : Vector3[] = new Array<Vector3>();

        let someCoords = Terrain3D01Coords.COORDS;
        let aNumCoords = someCoords.length;

        let aMinX= 1000000000;
        let aMinY= 1000000000;
        let aMaxX= -1000000000;
        let aMaxY= -1000000000;

        for( let aCoordIdx=0; aCoordIdx < aNumCoords; aCoordIdx++) {
            let aCoord = someCoords[ aCoordIdx];
            let anX = aCoord[ 0];
            if( anX > aMaxX) {
                aMaxX = anX;
            }
            else {
                if( anX < aMinX) {
                    aMinX = anX;
                }
            }

            let anY = aCoord[ 1];
            if( anY > aMaxY) {
                aMaxY = anY;
            }
            else {
                if( anY < aMinY) {
                    aMinY = anY;
                }
            }
        }

        let aWidth  = aMaxX - aMinX;
        let aHeight = aMaxY - aMinY;
        let aHalfWidth  = aWidth / 2;
        let aHalfHeight  = aHeight / 2;

        let aCenterX = aMinX + aHalfWidth;
        let aCenterY = aMinY + aHalfHeight;


        for( let aCoordIdx=0; aCoordIdx < aNumCoords; aCoordIdx++) {
            let aCoord = someCoords[ aCoordIdx];
            let aVector3 = new Vector3(
                aCoord[ 0] - aCenterX,
                0,
                aCoord[ 1] - aCenterY,
            );
            someVector3.push( aVector3);
        }
        return someVector3;
    }


    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new Scene( this._engine );

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        // this._camera = new FreeCamera( 'camera1', new Vector3( 0, 5, -10 ), this._scene );
        this._camera = new FreeCamera( 'camera1', new Vector3( 0, 100, 0 ), this._scene );

        // target the camera to scene origin
        this._camera.setTarget( Vector3.Zero() );

        // attach the camera to the canvas
        this._camera.attachControl( this._canvas, false );

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new HemisphericLight( 'light1', new Vector3( 0, 1, 0 ), this._scene );

/*
        // create a built-in "sphere" shape; with 16 segments and diameter of 2
        let sphere = MeshBuilder.CreateSphere( 'sphere1',
                                               { segments: 16, diameter: 2 }, this._scene );

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // create a built-in "ground" shape
        let ground = MeshBuilder.CreateGround( 'ground1',
                                               { width: 6, height: 6, subdivisions: 2 }, this._scene );
*/
        // create a terrain polygon shape
        let someVector3 = this.coordsAsVector3();
        this._parcelasFlat = MeshBuilder.CreatePolygon( 'terrain01',
                                                 { shape: someVector3, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this._scene );

        this._parcelasExtruded = MeshBuilder.ExtrudePolygon( "terrain01Extruded",
                                                             { shape: someVector3, depth: 20, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this._scene );



    }




    animate(): void {
        // run the render loop
        this._engine.runRenderLoop( () => {
            this._scene.render();
        } );

        // the canvas/window resize event handler
        window.addEventListener( 'resize', () => {
            this._engine.resize();
        } );
    }
}
