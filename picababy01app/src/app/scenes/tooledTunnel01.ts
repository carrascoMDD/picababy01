import {
    int, double,
    Vector2, Vector3,
    Color3,
    Engine, Scene, Light,
    StandardMaterial, DynamicTexture,
    MeshBuilder, VertexData, Mesh,
    HemisphericLight,
    ArcRotateCamera
}                              from 'babylonjs';
import { TooledTunnelParms01 } from "./tooledTunnelParms01";




export class TooledTunnel01 {

    public tooledTunnelParms: TooledTunnelParms01;

    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: ArcRotateCamera;
    private _light: Light;

    private _borderAngleStart: double;
    private _borderAngleStop: double;
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




    constructor( theTooledTunnelParms?: TooledTunnelParms01 ) {
        this.tooledTunnelParms = theTooledTunnelParms;
        if( this.tooledTunnelParms == null) {
            this.tooledTunnelParms = TooledTunnelParms01.defaultParms();
        }
    }



    bindToCanvas( theCanvasElementDomId: string) {
        this._canvas = <HTMLCanvasElement>document.getElementById( theCanvasElementDomId );
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
        this._scene = new Scene( this._engine );

        this._camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, this.tooledTunnelParms.cameraRadius, Vector3.Zero(), this._scene);
        this._camera.wheelDeltaPercentage = 0.01;
        this._camera.attachControl( this._canvas, true);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new HemisphericLight( 'light1', new Vector3( 0, 1, 0 ), this._scene );

        this.renderElements();
    }




    renderElements(): void {
        // Add and keep elements

        this._camera.radius = this.tooledTunnelParms.cameraRadius;

            // axis
        this.showAxis();

        // Call first borderAngles_calcAndSet to calculate the actual start and stop angles for the borders
        this.borderAngles_calcAndSet();

        // Call first mazeBorderNumSteps_calcAndSet for the Outer Border which shall set the Angle, and calculate the NumSteps, both of which shall be reused in the inner ond outer borders and sheets
        this.mazeBorderNumSteps_calcAndSet();

        // Call first mazeSheetNumStruts_calcAndSet for the Outer Sheet which shall set the NumStruts, which shall be reused in the inner ond outer sheets
        this.mazeSheetNumStruts_calcAndSet();

        this._outerBorderMesh = this.mazeOuterBorder();
        this._outerSheetMesh  = this.mazeOuterSheet();

        this._innerBorderMesh = this.mazeInnerBorder();
        this._innerSheetMesh  = this.mazeInnerSheet();

        this._nearCapMesh = this.mazeNearCap();
        this._farCapMesh  = this.mazeFarCap();

        this._floorNearCapMesh = this.mazeFloorNearCap();
        this._floorFarCapMesh  = this.mazeFloorFarCap();
    }


    updateScene():void {
        this.disposeMeshes();
        this.resetCalculated();

        this.renderElements();
    }



    disposeMeshes():void {
        if(!( this._outerBorderMesh == null)) {
            this._outerBorderMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._outerBorderMesh = null;
        }

        if(!( this._outerSheetMesh == null)) {
            this._outerSheetMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._outerSheetMesh = null;
        }

        if(!( this._innerBorderMesh == null)) {
            this._innerBorderMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._innerBorderMesh = null;
        }

        if(!( this._innerSheetMesh == null)) {
            this._innerSheetMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._innerSheetMesh = null;
        }

        if(!( this._nearCapMesh == null)) {
            this._nearCapMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._nearCapMesh = null;
        }

        if(!( this._farCapMesh == null)) {
            this._farCapMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._farCapMesh = null;
        }

        if(!( this._floorNearCapMesh == null)) {
            this._floorNearCapMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._floorNearCapMesh = null;
        }

        if(!( this._floorFarCapMesh == null)) {
            this._floorFarCapMesh.dispose( false /* doNotRecurse */, true /* disposeMaterialAndTextures */);
            this._floorFarCapMesh = null;
        }
    }


    resetCalculated(): void {

        this._borderAngleStart = null;
        this._borderAngleStop = null;
        this._borderNumSteps = null;
        this._sheetNumStruts = null;
        this._lastStrutZ = null;

        this._outerRadius = null;
        this._outerBorderPoints = null;
        this._outerSheetVertexData = null;
        this._outerLastStrutZ = null;

        this._innerRadius = null;
        this._innerBorderPoints = null;
        this._innerSheetVertexData = null;
        this._innerLastStrutZ = null;

        this._nearCapVertexData = null;
        this._farCapVertexData = null;

        this._floorNearCapVertexData = null;
        this._floorFarCapVertexData = null;
    }





    // Call first borderAngles_calcAndSet to calculate the actual start and stop angles for the borders
    borderAngles_calcAndSet(): void {
        const aHalfBorderAngle  = this.tooledTunnelParms.borderAngle / 2.0;
        const aBorderAngleBegin = 0.0 - aHalfBorderAngle;

        this._borderAngleStart = aBorderAngleBegin - this.tooledTunnelParms.borderAngleRotate;
        this._borderAngleStop  = this._borderAngleStart + this.tooledTunnelParms.borderAngle;
    }





    mazeBorderNumSteps_calcAndSet(): int {

        const aCircleLen = 2 * Math.PI * this.tooledTunnelParms.outerRadius;
        const anArcLen = aCircleLen * ( this.tooledTunnelParms.borderAngle / ( 2 * Math.PI));

        this._borderNumSteps = this.tooledTunnelParms.borderStepsDefault;
        const aTileLen = anArcLen / this._borderNumSteps;
        if( aTileLen > this.tooledTunnelParms.borderMaxStepLen) {
            this._borderNumSteps = anArcLen / this.tooledTunnelParms.borderMaxStepLen;
            if( !( Math.floor( this._borderNumSteps) == this._borderNumSteps)) {
                this._borderNumSteps = Math.floor( this._borderNumSteps) + 1;
            }
        }

        return this._borderNumSteps;
    }


    mazeSheetNumStruts_calcAndSet( ): int {

        this._sheetNumStruts = this.tooledTunnelParms.sheetStepsDefault;
        const aStrutLen = this.tooledTunnelParms.outerLength / this._sheetNumStruts;
        if( aStrutLen > this.tooledTunnelParms.sheetMaxStrutsLen) {
            this._sheetNumStruts = this.tooledTunnelParms.outerLength / this.tooledTunnelParms.sheetMaxStrutsLen;
            if( !( Math.floor( this._sheetNumStruts) == this._sheetNumStruts)) {
                this._sheetNumStruts = Math.floor( this._sheetNumStruts) + 1;
            }
        }

        return this._sheetNumStruts;
    }




    mazeOuterBorder(): Mesh {
        const someBorderPoints = this.mazeOuterBorderPoints( this.tooledTunnelParms.outerRadius);
        return MeshBuilder.CreateLines( "mazeOuterBorder01", { points: someBorderPoints});
    }


    mazeOuterBorderPoints( theRadius: double): Vector3[] {

        if( !( this._outerBorderPoints == null)) {
            return this._outerBorderPoints;
        }

        this._outerRadius = theRadius;

        this._outerBorderPoints = this.mazeBorderPoints_calc( theRadius);
        return this._outerBorderPoints;
    }



    mazeInnerBorder(): Mesh {
        const someBorderPoints = this.mazeInnerBorderPoints(  this.tooledTunnelParms.innerRadius);
        return MeshBuilder.CreateLines( "mazeInnerBorder01", { points: someBorderPoints});
    }


    mazeInnerBorderPoints( theRadius: double): Vector3[] {

        if( !( this._innerBorderPoints == null)) {
            return this._innerBorderPoints;
        }

        this._innerRadius = theRadius;

        this._innerBorderPoints = this.mazeBorderPoints_calc( theRadius);
        return this._innerBorderPoints;
    }



    mazeBorderPoints_calc( theRadius: double): Vector3[] {
        const someBorderPoints: Vector3[] = [ ];

        const aCenter = Vector2.Zero();

        for( let anStepIdx=0; anStepIdx <= this._borderNumSteps; anStepIdx++) {
            const anAngle = this._borderAngleStart +  this.tooledTunnelParms.borderAngle * anStepIdx / this._borderNumSteps;
            const aBorderPoint = this.mazeBorderPoint( aCenter, theRadius, anAngle);
            someBorderPoints.push( aBorderPoint);
        }
        return someBorderPoints;
    }


    mazeBorderPoint( theCenter: Vector2, theRadius: double, theAngle: double): Vector3 {

        let anX = Math.cos( theAngle) * theRadius;
        let anY = Math.sin( theAngle)  * theRadius;
        anX += theCenter.x;
        anY += theCenter.y;

        return new Vector3( anX, anY, 0);
    }





    mazeOuterSheet(): Mesh {

        const aVertexData = this.mazeOuterSheetVertexData( this.tooledTunnelParms.outerRadius, this.tooledTunnelParms.outerLength);
        const aSheetMesh = new Mesh( "mazeOuterSheet01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }


    mazeInnerSheet( ): Mesh {

        const aVertexData = this.mazeInnerSheetVertexData( this.tooledTunnelParms.innerRadius, this.tooledTunnelParms.innerLength);
        const aSheetMesh = new Mesh( "mazeInnerSheet02", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }




    mazeOuterSheetVertexData( theRadius: double, theLength: double): VertexData {

        if( !( this._outerSheetVertexData == null)) {
            return this._outerSheetVertexData;
        }

        this._outerSheetVertexData = this.mazeSheetVertexData_calc(
            theRadius,
            theLength,
            this.mazeOuterBorderPoints( theRadius),
            false /* theReverseFacets */,
            true /* theBuildFloor */
        );
        this._outerLastStrutZ = this._lastStrutZ;
        return this._outerSheetVertexData;
    }


    mazeInnerSheetVertexData( theRadius: double, theLength: double): VertexData {

        if( !( this._innerSheetVertexData == null)) {
            return this._innerSheetVertexData;
        }

        this._innerSheetVertexData = this.mazeSheetVertexData_calc(
            theRadius,
            theLength,
            this.mazeInnerBorderPoints( theRadius),
            true  /* theReverseFacets */,
            true /* theBuildFloor */
        );
        this._innerLastStrutZ = this._lastStrutZ;
        return this._innerSheetVertexData;
    }



    mazeSheetVertexData_calc(
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



    mazeNearCap(): Mesh {
        const aVertexData = this.mazeNearCapVertexData();
        const aSheetMesh = new Mesh( "mazeNearCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }


    mazeFarCap(): Mesh {
        const aVertexData = this.mazeFarCapVertexData();
        const aSheetMesh = new Mesh( "mazeFarCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }



    mazeNearCapVertexData(): VertexData {

        if( !( this._nearCapVertexData == null)) {
            return this._nearCapVertexData;
        }

        this._nearCapVertexData = this.mazeCapVertexData_calc( 0 /* theOuterZ */, 0 /* theInnerZ */, true/* theReverseFacets */);
        return this._nearCapVertexData;
    }

    mazeFarCapVertexData(): VertexData {

        if( !( this._farCapVertexData == null)) {
            return this._farCapVertexData;
        }

        this._farCapVertexData = this.mazeCapVertexData_calc(   this._outerLastStrutZ, this._innerLastStrutZ, false  /* theReverseFacets */);
        return this._farCapVertexData;
    }



    mazeCapVertexData_calc( theOuterZ: double, theInnerZ: double, theReverseFacets: Boolean): VertexData {

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





    mazeFloorNearCap(): Mesh {
        const aVertexData = this.mazeFloorNearCapVertexData();
        const aSheetMesh = new Mesh( "mazeFloorNearCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }


    mazeFloorFarCap(): Mesh {
        const aVertexData = this.mazeFloorFarCapVertexData();
        const aSheetMesh = new Mesh( "mazeFloorFarCap01", this._scene);
        aVertexData.applyToMesh( aSheetMesh);

        return aSheetMesh;
    }



    mazeFloorNearCapVertexData(): VertexData {

        if( !( this._floorNearCapVertexData == null)) {
            return this._floorNearCapVertexData;
        }

        this._floorNearCapVertexData = this.mazeFloorCapVertexData_calc( 0 /* theOuterZ */, 0 /* theInnerZ */, true/* theReverseFacets */);
        return this._floorNearCapVertexData;
    }

    mazeFloorFarCapVertexData(): VertexData {

        if( !( this._floorFarCapVertexData == null)) {
            return this._floorFarCapVertexData;
        }

        this._floorFarCapVertexData = this.mazeFloorCapVertexData_calc(   this._outerLastStrutZ, this._innerLastStrutZ, false  /* theReverseFacets */);
        return this._floorFarCapVertexData;
    }



    mazeFloorCapVertexData_calc( theOuterZ: double, theInnerZ: double, theReverseFacets: Boolean): VertexData {

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
        const dynamicTexture = new DynamicTexture("DynamicTexture"+theText, 50, this._scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText( theText, 5, 40, "bold 36px Arial", theColor , "transparent", true);
        const plane = Mesh.CreatePlane("TextPlane" + theText, theSize, this._scene, true);
        plane.material = new StandardMaterial("TextPlaneMaterial"+theText, this._scene);
        plane.material.backFaceCulling = false;
        (<StandardMaterial>plane.material).specularColor = new Color3(0, 0, 0);
        (<StandardMaterial>plane.material).diffuseTexture = dynamicTexture;
        return plane;
    };



    showAxis() : void {

        const axisX = Mesh.CreateLines("axisX", [
            Vector3.Zero(), new Vector3(this.tooledTunnelParms.axisSize, 0, 0), new Vector3(this.tooledTunnelParms.axisSize * 0.95, 0.05 * this.tooledTunnelParms.axisSize, 0),
            new Vector3(this.tooledTunnelParms.axisSize, 0, 0), new Vector3(this.tooledTunnelParms.axisSize * 0.95, -0.05 * this.tooledTunnelParms.axisSize, 0)
        ], this._scene);
        axisX.color = new Color3(1, 0, 0);
        const xChar = this.makeTextPlane("X", "red", this.tooledTunnelParms.axisSize / 10);
        xChar.position = new Vector3(0.9 * this.tooledTunnelParms.axisSize, -0.05 * this.tooledTunnelParms.axisSize, 0);
        const axisY = Mesh.CreateLines("axisY", [
            Vector3.Zero(), new Vector3(0, this.tooledTunnelParms.axisSize, 0), new Vector3( -0.05 * this.tooledTunnelParms.axisSize, this.tooledTunnelParms.axisSize * 0.95, 0),
            new Vector3(0, this.tooledTunnelParms.axisSize, 0), new Vector3( 0.05 * this.tooledTunnelParms.axisSize, this.tooledTunnelParms.axisSize * 0.95, 0)
        ], this._scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        const yChar = this.makeTextPlane("Y", "green", this.tooledTunnelParms.axisSize / 10);
        yChar.position = new Vector3(0, 0.9 * this.tooledTunnelParms.axisSize, -0.05 * this.tooledTunnelParms.axisSize);
        const axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            Vector3.Zero(), new Vector3(0, 0, this.tooledTunnelParms.axisSize * this.tooledTunnelParms.axisStretchZ), new Vector3( 0 , -0.05 * this.tooledTunnelParms.axisSize, this.tooledTunnelParms.axisSize * 0.95 * this.tooledTunnelParms.axisStretchZ),
            new Vector3(0, 0, this.tooledTunnelParms.axisSize * this.tooledTunnelParms.axisStretchZ), new Vector3( 0, 0.05 * this.tooledTunnelParms.axisSize, this.tooledTunnelParms.axisSize * 0.95 * this.tooledTunnelParms.axisStretchZ)
        ], this._scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        const zChar = this.makeTextPlane("Z", "blue", this.tooledTunnelParms.axisSize / 10);
        zChar.position = new Vector3(0, 0.05 * this.tooledTunnelParms.axisSize, 0.9 * this.tooledTunnelParms.axisSize * this.tooledTunnelParms.axisStretchZ);
    };




}
