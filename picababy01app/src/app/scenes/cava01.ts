import {
    int, double,
    Vector2, Vector3,
    Engine, Scene, FreeCamera, Light,
    MeshBuilder, VertexData, Mesh,
    HemisphericLight,
    ArcRotateCamera
} from 'babylonjs';



const BORDER_RADIUS = 1;
const BORDER_STEPS_DEFAULT = 32;
const SHEET_STEPS_DEFAULT  = 96;


export class Cava01 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _light: Light;
    private _borderMesh: Mesh;
    private _borderPoints: Vector3[];
    private _sheetMesh: Mesh;
    private _sheetVertexData: VertexData;




    constructor( canvasElement: string ) {
        this._canvas = <HTMLCanvasElement>document.getElementById( canvasElement );
        this._engine = new Engine( this._canvas, true );
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



    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new Scene( this._engine );

        var camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, 3, Vector3.Zero(), this._scene);
        camera.wheelDeltaPercentage = 0.01;
        camera.attachControl( this._canvas, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new HemisphericLight( 'light1', new Vector3( 0, 1, 0 ), this._scene );

        // Add and keep elements
        this._borderMesh = this.cavaBorder( 1, 0.01);

        this._sheetMesh = this.cavaSheet( 1, 5, 0.01);
    }





    cavaBorder( theRadius: double, theMaxStepLen: double): Mesh {
        const someBorderPoints = this.cavaBorderPoints( theRadius, theMaxStepLen, Math.PI);
        return MeshBuilder.CreateLines( "cavaBorder01", { points: someBorderPoints});
    }


    cavaBorderPoints( theRadius: double, theMaxStepLen: double, theAngle: double): Vector3[] {

        if( !( this._borderPoints == null)) {
            return this._borderPoints;
        }

        this._borderPoints = this.cavaBorderPoints_calc( theRadius, theMaxStepLen, theAngle);
        return this._borderPoints;
    }


    cavaBorderPoints_calc( theRadius: double, theMaxStepLen: double, theAngle: double): Vector3[] {
        const someBorderPoints: Vector3[] = [ ];

        const aCircleLen = 2 * Math.PI * theRadius;
        const anArcLen = aCircleLen * ( theAngle / ( 2 * Math.PI));

        let aNumSteps = BORDER_STEPS_DEFAULT;
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

        console.log( "someBorderPoints.length=" + someBorderPoints.length);
        return someBorderPoints;
    }


    cavaBorderPoint( theCenter: Vector2, theRadius: double, theAngle: double): Vector3 {

        let anX = theRadius * Math.cos( theAngle);
        let anY = theRadius * Math.sin( theAngle);
        anX += theCenter.x;
        anY += theCenter.y;

        return new Vector3( anX, anY, 0);
    }






    cavaSheet( theRadius: double, theLength: double, theMaxStepLen: double): Mesh {

        const aVertexData = this.cavaSheetVertexData( theRadius, theLength, theMaxStepLen);
        const aSheetMesh = new Mesh( "cavaSheet01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }




    cavaSheetVertexData( theRadius: double, theLength: double, theMaxStepLen: double): VertexData {

        if( !( this._sheetVertexData == null)) {
            return this._sheetVertexData;
        }

        this._sheetVertexData = this.cavaSheetVertexData_calc( theRadius, theLength, theMaxStepLen);
        return this._sheetVertexData;
    }




    cavaSheetVertexData_calc( theRadius: double, theLength: double, theMaxStepLen: double): VertexData {

        let aNumStruts = SHEET_STEPS_DEFAULT;
        const aStrutLen = theLength / aNumStruts;
        if( aStrutLen > theMaxStepLen) {
            aNumStruts = theLength / theMaxStepLen;
            if( !( Math.floor( aNumStruts) == aNumStruts)) {
                aNumStruts = Math.floor( aNumStruts) + 1;
            }
        }

        const somePositions: double[] = [ ];
        const someIndices:   int[]    = [ ];

        const someBorderPoints = this.cavaBorderPoints( theRadius, 0.01, Math.PI);
        const aNumBorderPoints = someBorderPoints.length;

        // Add positions for the first strut from the border with Z = 0. Each triple of these is a point in the first strut of the sheet
        for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
            const aBorderPoint = someBorderPoints[ aBorderPointIdx];
            somePositions.push( aBorderPoint.x);
            somePositions.push( aBorderPoint.y);
            somePositions.push( 0);
        }

        // Add positions for all the struts but the first as positions from the border displaced in Z by a Strut len
        for( let aStrutIdx=0; aStrutIdx < aNumStruts; aStrutIdx++) {

            // Add positions from the border displaced in Z by a Strut lengh. Each triple of these is a point in a strut of the sheet
            const aZ = aStrutIdx * theLength / aNumStruts;
            for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
                const aBorderPoint = someBorderPoints[ aBorderPointIdx];
                somePositions.push( aBorderPoint.x);
                somePositions.push( aBorderPoint.y);
                somePositions.push( aZ);
            }
        }

        // Add indices for the facets between all struts, starting between the strut index 1 and the border (strut 0)
        /* Two triangle facets, counter-clock-wise
          m = n - 1
          i = j - 1
            SmVi-----------SmVj
                | facet  /|
                | 0     / |
                |      /  |
                |     /   |
                |    /    |
                |   /     |
                |  /      |
                | /     1 |
                |/  facet |
            SnVi-----------SnVj

                facet 0:
                    SmVi, SnVi, SmVj
                facet 1:
                    SmVj,SnVi, SnVj
        */
        for( let aStrutIdx=1; aStrutIdx < aNumStruts; aStrutIdx++) {

            for( let aBorderPointIdx=1; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {

                const anInd_SmVi = ( ( aStrutIdx - 1 ) * aNumBorderPoints) + ( aBorderPointIdx - 1);
                const anInd_SmVj = ( ( aStrutIdx - 1 ) * aNumBorderPoints) + aBorderPointIdx;
                const anInd_SnVi = ( aStrutIdx * aNumBorderPoints) + ( aBorderPointIdx - 1);
                const anInd_SnVj = ( aStrutIdx * aNumBorderPoints) + aBorderPointIdx;

                // Facet 0
                someIndices.push( anInd_SmVi, anInd_SnVi, anInd_SmVj);
                // Facet1
                someIndices.push( anInd_SmVj, anInd_SnVi, anInd_SnVj);
            }

        }


        const aVertexData = new VertexData();
        aVertexData.positions = somePositions;
        aVertexData.indices   = someIndices;

        return aVertexData;
    }



}
