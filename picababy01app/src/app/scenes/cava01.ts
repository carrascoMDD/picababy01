import {
    int, double,
    Vector2, Vector3,
    Color3,
    Engine, Scene, FreeCamera, Light,
    DynamicTexture,
    MeshBuilder, VertexData, Mesh,
    HemisphericLight,
    ArcRotateCamera
} from 'babylonjs';
import StandardMaterial = BABYLON.StandardMaterial;



const AXIS_SIZE  = 1.5;
const AXIS_STRETCH_Z = 2.5;

const BORDER_ANGLE = Math.PI * ( 7 / 5);
const BORDER_ANGLE_BEGIN = 0.0 - BORDER_ANGLE / 2;
const BORDER_ANGLE_END   = BORDER_ANGLE / 2;

const BORDER_ANGLE_ROTATE = 0.0 - Math.PI / 2;
const BORDER_ANGLE_START  = BORDER_ANGLE_BEGIN - BORDER_ANGLE_ROTATE;
const BORDER_ANGLE_STOP   = BORDER_ANGLE_END   - BORDER_ANGLE_ROTATE;

const BORDER_STEPS_DEFAULT = 64;
const SHEET_STEPS_DEFAULT  = 1;

const OUTERRADIUS  = 3;
const MAXSTEPLEN   = 0.6;

const MAXSTRUTLEN  = 0.2;


const OUTERLENGTH  = 8;
const INNERRADIUS  = 2.5;
const INNERLENGTH  = 8;

const CAMERA_RADIUS = 10;



export class Cava01 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _light: Light;

    private _borderAngleStart: double;
    private _borderAngleStop: double;
    private _borderAngle: double;
    private _borderMaxStepLen: double;
    private _borderNumSteps: int;
    private _sheetNumStruts: int;
    private _lastStrutZ: double;

    private _outerRadius: double;
    private _outerBorderPoints: Vector3[];
    private _outerBorderMesh: Mesh;
    private _outerSheetVertexData: VertexData;
    private _outerSheetMesh: Mesh;
    private _outerLastStrutZ: double;

    private _innerRadius: double;
    private _innerBorderPoints: Vector3[];
    private _innerBorderMesh:Mesh;
    private _innerSheetVertexData: VertexData;
    private _innerSheetMesh: Mesh;
    private _innerLastStrutZ: double;

    private _nearCapVertexData: VertexData;
    private _nearCapMesh: Mesh;
    private _farCapVertexData:  VertexData;
    private _farCapMesh:  Mesh;

    private _floorNearCapVertexData: VertexData;
    private _floorNearCapMesh: Mesh;
    private _floorFarCapVertexData:  VertexData;
    private _floorFarCapMesh:  Mesh;




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

        var camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, CAMERA_RADIUS, Vector3.Zero(), this._scene);
        camera.wheelDeltaPercentage = 0.01;
        camera.attachControl( this._canvas, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new HemisphericLight( 'light1', new Vector3( 0, 1, 0 ), this._scene );


        // axis
        this.showAxis( AXIS_SIZE);

        // Add and keep elements

        // Call first cavaBorderNumSteps_calcAndSet for the Outer Border which shall set the Angle, and calculate the NumSteps, both of which shall be reused in the inner ond outer borders and sheets
        this.cavaBorderNumSteps_calcAndSet(  OUTERRADIUS, MAXSTEPLEN, BORDER_ANGLE_START, BORDER_ANGLE_STOP);

        // Call first cavaSheetNumStruts_calcAndSet for the Outer Sheet which shall set the NumStruts, which shall be reused in the inner ond outer sheets
        this.cavaSheetNumStruts_calcAndSet( OUTERLENGTH, MAXSTRUTLEN);

        this._outerBorderMesh = this.cavaOuterBorder( OUTERRADIUS);
        this._outerSheetMesh  = this.cavaOuterSheet( OUTERRADIUS, OUTERLENGTH);

        this._innerBorderMesh = this.cavaInnerBorder( INNERRADIUS);
        this._innerSheetMesh  = this.cavaInnerSheet( INNERRADIUS, INNERLENGTH);

        this._nearCapMesh = this.cavaNearCap();
        this._farCapMesh  = this.cavaFarCap();

        this._floorNearCapMesh = this.cavaFloorNearCap();
        this._floorFarCapMesh  = this.cavaFloorFarCap();
    }







    cavaBorderNumSteps_calcAndSet( theRadius: double, theMaxStepLen: double, theAngleStart: double, theAngleStop: double): int {

        this._borderMaxStepLen = theMaxStepLen;
        this._borderAngleStart = theAngleStart;
        this._borderAngleStop  = theAngleStop;
        this._borderAngle      = this._borderAngleStop - this._borderAngleStart;

        const aCircleLen = 2 * Math.PI * theRadius;
        const anArcLen = aCircleLen * ( this._borderAngle / ( 2 * Math.PI));

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

        this._outerRadius = theRadius;

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

        this._innerRadius = theRadius;

        this._innerBorderPoints = this.cavaBorderPoints_calc( theRadius);
        return this._innerBorderPoints;
    }



    cavaBorderPoints_calc( theRadius: double): Vector3[] {
        const someBorderPoints: Vector3[] = [ ];

        const aCenter = Vector2.Zero();

        for( let anStepIdx=0; anStepIdx < this._borderNumSteps; anStepIdx++) {
            const anAngle = this._borderAngleStart +  this._borderAngle * anStepIdx / this._borderNumSteps;
            const aBorderPoint = this.cavaBorderPoint( aCenter, theRadius, anAngle);
            someBorderPoints.push( aBorderPoint);
        }
        return someBorderPoints;
    }


    cavaBorderPoint( theCenter: Vector2, theRadius: double, theAngle: double): Vector3 {

        let anX = Math.cos( theAngle) * theRadius;
        let anY = Math.sin( theAngle)  * theRadius;
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

        this._outerSheetVertexData = this.cavaSheetVertexData_calc(
            theRadius,
            theLength,
            this.cavaOuterBorderPoints( theRadius),
            false /* theReverseFacets */,
            true /* theBuildFloor */
        );
        this._outerLastStrutZ = this._lastStrutZ;
        return this._outerSheetVertexData;
    }


    cavaInnerSheetVertexData( theRadius: double, theLength: double): VertexData {

        if( !( this._innerSheetVertexData == null)) {
            return this._innerSheetVertexData;
        }

        this._innerSheetVertexData = this.cavaSheetVertexData_calc(
            theRadius,
            theLength,
            this.cavaInnerBorderPoints( theRadius),
            true  /* theReverseFacets */,
            true /* theBuildFloor */
        );
        this._innerLastStrutZ = this._lastStrutZ;
        return this._innerSheetVertexData;
    }



    cavaSheetVertexData_calc(
        theRadius: double,
        theLength: double,
        theBorderPoints:  Vector3[],
        theReverseFacets: Boolean,
        theBuildFloor: Boolean): VertexData {

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
        for( let aStrutIdx=0; aStrutIdx <= this._sheetNumStruts; aStrutIdx++) {

            // Add positions from the border displaced in Z by a Strut lengh. Each triple of these is a point in a strut of the sheet
            this._lastStrutZ = aStrutIdx * theLength / this._sheetNumStruts;
            for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
                const aBorderPoint = theBorderPoints[ aBorderPointIdx];
                somePositions.push( aBorderPoint.x);
                somePositions.push( aBorderPoint.y);
                somePositions.push( this._lastStrutZ);
            }
        }

        // Add indices for the facets between all struts, starting between the strut index 1 and the border (strut 0)
        // If theBuildFloor then Add indices for the facets between the extremes of the struts, starting between the strut index 1 and the border (strut 0)
        /* Two triangle facets, counter-clock-wise
          m = n - 1 aStrutIdx
          i = j - 1 aBorderPointIdx
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
        const aNumIterStruts = this._sheetNumStruts + 1;
        for( let aStrutIdx=1; aStrutIdx <= aNumIterStruts; aStrutIdx++) {

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


            if( theBuildFloor) {
                /* Indices for two triangle facets between the opposite ends of a strut and the predecessor strut
                   m = n - 1 aStrutIdx
                   v = aNumBorderPoints - 1
                    SnV0-----------SmV0
                        | facet  /|
                        | 0     / |
                        |      /  |
                        |     /   |
                        |    /    |
                        |   /     |
                        |  /      |
                        | /     1 |
                        |/  facet |
                    SnVv-----------SmVv

                Note that for the floor, theReverseFacets works in reverse
                if theReverseFacets is true then build facets with points order counter-clock-wise (outer sheet)
                    facet 0:
                        SnV0, SnVv, SmV0
                    facet 1:
                        SnVv,SmVv, SmV0

                if theReverseFacets is false then build facets with points order clock-wise (inner sheet)
                    facet 0:
                        SnV0, SmV0, SnVv
                    facet 1:
                        SmV0,SmVv, SnVv

                 */

                const anInd_SmV0 = ( aStrutIdx - 1 ) * aNumBorderPoints;
                const anInd_SmVv = ( ( aStrutIdx - 1 ) * aNumBorderPoints) + ( aNumBorderPoints - 1);
                const anInd_SnV0 = aStrutIdx * aNumBorderPoints;
                const anInd_SnVv = ( aStrutIdx * aNumBorderPoints) + + ( aNumBorderPoints - 1);

                if( theReverseFacets) {
                    // Facet 0
                    someIndices.push( anInd_SnV0, anInd_SnVv, anInd_SmV0);
                    // Facet1
                    someIndices.push( anInd_SnVv, anInd_SmVv, anInd_SmV0);
                }
                else {
                    // Facet 0
                    someIndices.push( anInd_SnV0, anInd_SmV0, anInd_SnVv);
                    // Facet1
                    someIndices.push( anInd_SmV0, anInd_SmVv, anInd_SnVv);
                }
            }

        }




        const aVertexData = new VertexData();
        aVertexData.positions = somePositions;
        aVertexData.indices   = someIndices;

        return aVertexData;
    }



    cavaNearCap(): Mesh {
        const aVertexData = this.cavaNearCapVertexData();
        const aSheetMesh = new Mesh( "cavaNearCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }


    cavaFarCap(): Mesh {
        const aVertexData = this.cavaFarCapVertexData();
        const aSheetMesh = new Mesh( "cavaFarCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }



    cavaNearCapVertexData(): VertexData {

        if( !( this._nearCapVertexData == null)) {
            return this._nearCapVertexData;
        }

        this._nearCapVertexData = this.cavaCapVertexData_calc( 0 /* theOuterZ */, 0 /* theInnerZ */, true/* theReverseFacets */);
        return this._nearCapVertexData;
    }

    cavaFarCapVertexData(): VertexData {

        if( !( this._farCapVertexData == null)) {
            return this._farCapVertexData;
        }

        this._farCapVertexData = this.cavaCapVertexData_calc(   this._outerLastStrutZ, this._innerLastStrutZ, false  /* theReverseFacets */);
        return this._farCapVertexData;
    }



    cavaCapVertexData_calc( theOuterZ: double, theInnerZ: double, theReverseFacets: Boolean): VertexData {

        const somePositions: double[] = [ ];
        const someIndices:   int[]    = [ ];

        const aNumBorderPoints = this._outerBorderPoints.length;

        // Add positions for the outer arc of the cap from the border with Z = theZ. Each triple of these is a point in the first strut of the sheet
        for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
            const aBorderPoint = this._outerBorderPoints[ aBorderPointIdx];
            somePositions.push( aBorderPoint.x);
            somePositions.push( aBorderPoint.y);
            somePositions.push( theOuterZ);
        }

        // Add positions for the inner arc of the cap from the border with Z = theZ. Each triple of these is a point in the first strut of the sheet
        for( let aBorderPointIdx=0; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {
            const aBorderPoint = this._innerBorderPoints[ aBorderPointIdx];
            somePositions.push( aBorderPoint.x);
            somePositions.push( aBorderPoint.y);
            somePositions.push( theInnerZ);
        }

        // Add indices for the facets between the outer and the inner arcs
        /* Two triangle facets, counter-clock-wise
          m = outer
          n = inner
          i = j - 1 aBorderPointIdx
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

        for( let aBorderPointIdx=1; aBorderPointIdx < aNumBorderPoints; aBorderPointIdx++) {

            const anInd_SmVi = aBorderPointIdx - 1;
            const anInd_SmVj = aBorderPointIdx;
            const anInd_SnVi = aNumBorderPoints + ( aBorderPointIdx - 1);
            const anInd_SnVj = aNumBorderPoints + aBorderPointIdx;

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

        const aVertexData = new VertexData();
        aVertexData.positions = somePositions;
        aVertexData.indices   = someIndices;

        return aVertexData;
    }





    cavaFloorNearCap(): Mesh {
        const aVertexData = this.cavaFloorNearCapVertexData();
        const aSheetMesh = new Mesh( "cavaFloorNearCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }


    cavaFloorFarCap(): Mesh {
        const aVertexData = this.cavaFloorFarCapVertexData();
        const aSheetMesh = new Mesh( "cavaFloorFarCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }



    cavaFloorNearCapVertexData(): VertexData {

        if( !( this._floorNearCapVertexData == null)) {
            return this._floorNearCapVertexData;
        }

        this._floorNearCapVertexData = this.cavaFloorCapVertexData_calc( 0 /* theOuterZ */, 0 /* theInnerZ */, true/* theReverseFacets */);
        return this._floorNearCapVertexData;
    }

    cavaFloorFarCapVertexData(): VertexData {

        if( !( this._floorFarCapVertexData == null)) {
            return this._floorFarCapVertexData;
        }

        this._floorFarCapVertexData = this.cavaFloorCapVertexData_calc(   this._outerLastStrutZ, this._innerLastStrutZ, false  /* theReverseFacets */);
        return this._floorFarCapVertexData;
    }



    cavaFloorCapVertexData_calc( theOuterZ: double, theInnerZ: double, theReverseFacets: Boolean): VertexData {

        const somePositions: double[] = [ ];
        const someIndices:   int[]    = [ ];


        const anOuterFirstBorderPoint = this._outerBorderPoints[ 0];
        somePositions.push( anOuterFirstBorderPoint.x);
        somePositions.push( anOuterFirstBorderPoint.y);
        somePositions.push( theOuterZ);

        const anOuterLastBorderPoint = this._outerBorderPoints[ this._outerBorderPoints.length - 1];
        somePositions.push( anOuterLastBorderPoint.x);
        somePositions.push( anOuterLastBorderPoint.y);
        somePositions.push( theOuterZ);


        const anInnerFirstBorderPoint = this._innerBorderPoints[ 0];
        somePositions.push( anInnerFirstBorderPoint.x);
        somePositions.push( anInnerFirstBorderPoint.y);
        somePositions.push( theInnerZ);

        const anInnerLastBorderPoint = this._innerBorderPoints[ this._innerBorderPoints.length - 1];
        somePositions.push( anInnerLastBorderPoint.x);
        somePositions.push( anInnerLastBorderPoint.y);
        somePositions.push( theInnerZ);


        // Add indices for the facets between the outer and the inner first and last border points
        /* Two triangle facets, counter-clock-wise
          O = outer
          I = inner
          0 first point in border
          n last point in border
            0 I0-----------In 1
                | facet  /|
                | 0     / |
                |      /  |
                |     /   |
                |    /    |
                |   /     |
                |  /      |
                | /     1 |
                |/  facet |
           2  O0-----------On 3

            if theReverseFacets is false then build facets with points order counter-clock-wise (outer sheet)
                facet 0:
                    I0, O0, In  0 2 1
                facet 1:
                    In, O0, On  1 2 3

          if theReverseFacets is true then build facets with points order clock-wise (inner sheet)
                facet 0:
                    I0, In, O0  0 1 2
                facet 1:
                    In, On, O0 1 3 2
        */

        if( theReverseFacets) {
            // Facet 0
            someIndices.push( 0, 2, 1);
            // Facet1
            someIndices.push( 1, 2, 3);
        }
        else {
            // Facet 0
            someIndices.push( 0, 1, 2);
            // Facet1
            someIndices.push( 1, 3, 2);
        }


        const aVertexData = new VertexData();
        aVertexData.positions = somePositions;
        aVertexData.indices   = someIndices;

        return aVertexData;
    }



    makeTextPlane( theText: string, theColor: string, theSize: number): Mesh {
        const dynamicTexture = new DynamicTexture("DynamicTexture", 50, this._scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText( theText, 5, 40, "bold 36px Arial", theColor , "transparent", true);
        var plane = Mesh.CreatePlane("TextPlane", theSize, this._scene, true);
        plane.material = new StandardMaterial("TextPlaneMaterial", this._scene);
        plane.material.backFaceCulling = false;
        (<StandardMaterial>plane.material).specularColor = new Color3(0, 0, 0);
        (<StandardMaterial>plane.material).diffuseTexture = dynamicTexture;
        return plane;
    };



    showAxis( theSize: number) : void {

        var axisX = Mesh.CreateLines("axisX", [
            Vector3.Zero(), new Vector3(theSize, 0, 0), new Vector3(theSize * 0.95, 0.05 * theSize, 0),
            new Vector3(theSize, 0, 0), new Vector3(theSize * 0.95, -0.05 * theSize, 0)
        ], this._scene);
        axisX.color = new Color3(1, 0, 0);
        var xChar = this.makeTextPlane("X", "red", theSize / 10);
        xChar.position = new Vector3(0.9 * theSize, -0.05 * theSize, 0);
        var axisY = Mesh.CreateLines("axisY", [
            Vector3.Zero(), new Vector3(0, theSize, 0), new Vector3( -0.05 * theSize, theSize * 0.95, 0),
            new Vector3(0, theSize, 0), new Vector3( 0.05 * theSize, theSize * 0.95, 0)
        ], this._scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = this.makeTextPlane("Y", "green", theSize / 10);
        yChar.position = new Vector3(0, 0.9 * theSize, -0.05 * theSize);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            Vector3.Zero(), new Vector3(0, 0, theSize * AXIS_STRETCH_Z), new Vector3( 0 , -0.05 * theSize, theSize * 0.95 * AXIS_STRETCH_Z),
            new Vector3(0, 0, theSize * AXIS_STRETCH_Z), new Vector3( 0, 0.05 * theSize, theSize * 0.95 * AXIS_STRETCH_Z)
        ], this._scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = this.makeTextPlane("Z", "blue", theSize / 10);
        zChar.position = new Vector3(0, 0.05 * theSize, 0.9 * theSize * AXIS_STRETCH_Z);
    };




}
