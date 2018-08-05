import {
    int, double,
    Vector2, Vector3,
    Engine, Scene, FreeCamera, Light,
    MeshBuilder, VertexData, Mesh,
    HemisphericLight,
    ArcRotateCamera
} from 'babylonjs';



const BORDER_ANGLE = Math.PI;
const BORDER_STEPS_DEFAULT = 32;
const SHEET_STEPS_DEFAULT  = 96;


export class Cava01 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _light: Light;

    private _borderAngle: double;
    private _borderMaxStepLen: double;
    private _borderNumSteps: int;
    private _sheetNumStruts: int;

    private _outerBorderPoints: Vector3[];
    private _outerBorderMesh: Mesh;
    private _outerSheetVertexData: VertexData;
    private _outerSheetMesh: Mesh;

    private _innerBorderPoints: Vector3[];
    private _innerBorderMesh:Mesh;
    private _innerSheetVertexData: VertexData;
    private _innerSheetMesh: Mesh;




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

        // Call first cavaBorderNumSteps_calcAndSet for the Outer Border which shall set the Angle, and calculate the NumSteps, both of which shall be reused in the inner ond outer borders and sheets
        this.cavaBorderNumSteps_calcAndSet(  1, 0.01, BORDER_ANGLE);

        // Call first cavaSheetNumStruts_calcAndSet for the Outer Sheet which shall set the NumStruts, which shall be reused in the inner ond outer sheets
        this.cavaSheetNumStruts_calcAndSet( 5, 0.01);

        this._outerBorderMesh = this.cavaOuterBorder( 1);
        this._outerSheetMesh  = this.cavaOuterSheet( 1, 5);

        this._innerBorderMesh = this.cavaInnerBorder( 0.9);
        this._innerSheetMesh  = this.cavaInnerSheet( 0.9, 5);
    }







    cavaBorderNumSteps_calcAndSet( theRadius: double, theMaxStepLen: double, theAngle: double): int {

        this._borderMaxStepLen = theMaxStepLen;
        this._borderAngle      = theAngle;

        const aCircleLen = 2 * Math.PI * theRadius;
        const anArcLen = aCircleLen * ( theAngle / ( 2 * Math.PI));

        this._borderNumSteps = BORDER_STEPS_DEFAULT;
        const aTileLen = anArcLen / this._borderNumSteps;
        if( aTileLen > theMaxStepLen) {
            this._borderNumSteps = anArcLen / theMaxStepLen;
            if( !( Math.floor( this._borderNumSteps) == this._borderNumSteps)) {
                this._borderNumSteps = Math.floor( this._borderNumSteps) + 1;
            }
        }

        return this._borderNumSteps;
    }



    cavaSheetNumStruts_calcAndSet( theLength: double, theMaxStrutLen: double): int {

        this._sheetNumStruts = SHEET_STEPS_DEFAULT;
        const aStrutLen = theLength / this._sheetNumStruts;
        if( aStrutLen > theMaxStrutLen) {
            this._sheetNumStruts = theLength / theMaxStrutLen;
            if( !( Math.floor( this._sheetNumStruts) == this._sheetNumStruts)) {
                this._sheetNumStruts = Math.floor( this._sheetNumStruts) + 1;
            }
        }

        return this._sheetNumStruts;
    }




        cavaOuterBorder( theRadius: double): Mesh {
        const someBorderPoints = this.cavaOuterBorderPoints( theRadius);
        return MeshBuilder.CreateLines( "cavaOuterBorder01", { points: someBorderPoints});
    }


    cavaOuterBorderPoints( theRadius: double): Vector3[] {

        if( !( this._outerBorderPoints == null)) {
            return this._outerBorderPoints;
        }

        this._outerBorderPoints = this.cavaBorderPoints_calc( theRadius);
        return this._outerBorderPoints;
    }



    cavaInnerBorder( theRadius: double): Mesh {
        const someBorderPoints = this.cavaInnerBorderPoints( theRadius);
        return MeshBuilder.CreateLines( "cavaInnerBorder01", { points: someBorderPoints});
    }


    cavaInnerBorderPoints( theRadius: double): Vector3[] {

        if( !( this._innerBorderPoints == null)) {
            return this._innerBorderPoints;
        }

        this._innerBorderPoints = this.cavaBorderPoints_calc( theRadius);
        return this._innerBorderPoints;
    }



    cavaBorderPoints_calc( theRadius: double): Vector3[] {
        const someBorderPoints: Vector3[] = [ ];

        const aCenter = Vector2.Zero();
        const aHalfAngle = this._borderAngle / 2;

        for( let anStepIdx=0; anStepIdx < this._borderNumSteps; anStepIdx++) {
            const anAngle = ( 0 - aHalfAngle) + ( this._borderAngle * anStepIdx) / this._borderNumSteps;
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






    cavaOuterSheet( theRadius: double, theLength: double): Mesh {

        const aVertexData = this.cavaOuterSheetVertexData( theRadius, theLength);
        const aSheetMesh = new Mesh( "cavaOuterSheet01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }


    cavaInnerSheet( theRadius: double, theLength: double): Mesh {

        const aVertexData = this.cavaInnerSheetVertexData( theRadius, theLength);
        const aSheetMesh = new Mesh( "cavaInnerSheet02", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }




    cavaOuterSheetVertexData( theRadius: double, theLength: double): VertexData {

        if( !( this._outerSheetVertexData == null)) {
            return this._outerSheetVertexData;
        }

        this._outerSheetVertexData = this.cavaSheetVertexData_calc( theRadius, theLength, this.cavaOuterBorderPoints( theRadius), false /* theReverseFacets */);
        return this._outerSheetVertexData;
    }


    cavaInnerSheetVertexData( theRadius: double, theLength: double): VertexData {

        if( !( this._innerSheetVertexData == null)) {
            return this._innerSheetVertexData;
        }

        this._innerSheetVertexData = this.cavaSheetVertexData_calc( theRadius, theLength, this.cavaInnerBorderPoints( theRadius), true  /* theReverseFacets */);
        return this._innerSheetVertexData;
    }



    cavaSheetVertexData_calc( theRadius: double, theLength: double, theBorderPoints:  Vector3[], theReverseFacets: Boolean): VertexData {

        const somePositions: double[] = [ ];
        const someIndices:   int[]    = [ ];

        const aNumBorderPoints = theBorderPoints.length;

        // Add positions for the first strut from the border with Z = 0. Each triple of these is a point in the first strut of the sheet
        for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
            const aBorderPoint = theBorderPoints[ aBorderPointIdx];
            somePositions.push( aBorderPoint.x);
            somePositions.push( aBorderPoint.y);
            somePositions.push( 0);
        }

        // Add positions for all the struts but the first as positions from the border displaced in Z by a Strut len
        for( let aStrutIdx=0; aStrutIdx < this._sheetNumStruts; aStrutIdx++) {

            // Add positions from the border displaced in Z by a Strut lengh. Each triple of these is a point in a strut of the sheet
            const aZ = aStrutIdx * theLength / this._sheetNumStruts;
            for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
                const aBorderPoint = theBorderPoints[ aBorderPointIdx];
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

            if theReverseFacets is false then build facets with points order counter-clock-wise (outer sheet)
                facet 0:
                    SmVi, SnVi, SmVj
                facet 1:
                    SmVj,SnVi, SnVj

          if theReverseFacets is true then build facets with points order clock-wise (inner sheet)
                facet 0:
                    SmVi, SmVj, SnVi
                facet 1:
                    SmVj,SnVj, SnVi
        */
        for( let aStrutIdx=1; aStrutIdx < this._sheetNumStruts; aStrutIdx++) {

            for( let aBorderPointIdx=1; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {

                const anInd_SmVi = ( ( aStrutIdx - 1 ) * aNumBorderPoints) + ( aBorderPointIdx - 1);
                const anInd_SmVj = ( ( aStrutIdx - 1 ) * aNumBorderPoints) + aBorderPointIdx;
                const anInd_SnVi = ( aStrutIdx * aNumBorderPoints) + ( aBorderPointIdx - 1);
                const anInd_SnVj = ( aStrutIdx * aNumBorderPoints) + aBorderPointIdx;

                if( !theReverseFacets) {
                    // Facet 0
                    someIndices.push( anInd_SmVi, anInd_SnVi, anInd_SmVj);
                    // Facet1
                    someIndices.push( anInd_SmVj, anInd_SnVi, anInd_SnVj);
                }
                else {
                    // Facet 0
                    someIndices.push( anInd_SmVi, anInd_SmVj, anInd_SnVi);
                    // Facet1
                    someIndices.push( anInd_SmVj, anInd_SnVj, anInd_SnVi);
                }

            }

        }

        const aVertexData = new VertexData();
        aVertexData.positions = somePositions;
        aVertexData.indices   = someIndices;

        return aVertexData;
    }



}
