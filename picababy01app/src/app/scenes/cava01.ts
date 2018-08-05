import {
    Engine, Scene, FreeCamera, Light,
    Vector3, HemisphericLight, MeshBuilder
} from 'babylonjs';

import Polygon = BABYLON.Polygon;
import Mesh = BABYLON.Mesh;
import double = BABYLON.double;
import Vector2 = BABYLON.Vector2;
import ArcRotateCamera = BABYLON.ArcRotateCamera;



const SUBSTRACTFROM_X=713250;
const SUBSTRACTFROM_Y=4361200;
const FIXEDZ=0;


const BORDERSTEPS_DEFAULT = 32;


export class Cava01 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _light: Light;
    private _border: Mesh;




    constructor( canvasElement: string ) {
        this._canvas = <HTMLCanvasElement>document.getElementById( canvasElement );
        this._engine = new Engine( this._canvas, true );
    }




    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new Scene( this._engine );


        var camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, 3, Vector3.Zero(), this._scene);

        camera.wheelDeltaPercentage = 0.01;
        camera.attachControl( this._canvas, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new HemisphericLight( 'light1', new Vector3( 0, 1, 0 ), this._scene );

        let someBorderPoints = this.cavaBorder( 1, 0.01, Math.PI);

        this._border = MeshBuilder.CreateLines( "cavaBorder01", { points: someBorderPoints});


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


    cavaBorder( theRadius: double, theMaxStepLen: double, theAngle: double): Vector3[] {

        const someBorderPoints: Vector3[] = [];

        const aCircleLen = 2 * Math.PI * theRadius;
        const anArcLen = aCircleLen * ( theAngle / ( 2 * Math.PI));

        let aNumSteps = BORDERSTEPS_DEFAULT;
        const aTileLen = anArcLen / aNumSteps;
        if( aTileLen > theMaxStepLen) {
            aNumSteps = anArcLen / theMaxStepLen;
            if( !( Math.floor( aNumSteps) == aNumSteps)) {
                aNumSteps = Math.floor( aNumSteps) + 1;
            }
        }

        const aCenter = Vector2.Zero();
        const aHalfAngle = theAngle / 2;

        for( let anStepIdx=0; anStepIdx < aNumSteps; anStepIdx++) {
            const anAngle = ( 0 - aHalfAngle) + ( theAngle * anStepIdx) / aNumSteps;
            const aBorderPoint = this.cavaBorderPoint( aCenter, theRadius, anAngle);
            someBorderPoints.push( aBorderPoint);
        }

        console.log( "someBorderPoints.length=" + someBorderPoints.length)
        return someBorderPoints;
    }


    cavaBorderPoint( theCenter: Vector2, theRadius: double, theAngle: double): Vector3 {

        let anX = theRadius * Math.cos( theAngle);
        let anY = theRadius * Math.sin( theAngle);
        anX += theCenter.x;
        anY += theCenter.y;
        return new Vector3( anX, anY, 0);
    }

}
