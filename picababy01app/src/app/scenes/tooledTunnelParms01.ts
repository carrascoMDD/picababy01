import {
    int, double,
} from 'babylonjs';



const BORDER_ANGLE = Math.PI * ( 7 / 5);
const BORDER_ANGLE_ROTATE = 0.0 - Math.PI / 2;
const BORDER_STEPS_DEFAULT = 64;
const MAXSTEPLEN   = 1;

const SHEET_STEPS_DEFAULT  = 1;
const MAXSTRUTLEN  = 10;

const OUTERRADIUS  = 3;
const OUTERLENGTH  = 10;

const INNERRADIUS  = 2.5;
const INNERLENGTH  = 9.5;

const AXIS_SIZE  = 4;
const AXIS_STRETCH_Z = 2.8;

const CAMERA_RADIUS = 12;



export class TooledTunnelParms01 {

    constructor(
        private _borderAngle: double,
        private _borderAngleRotate: double,
        private _borderStepsDefault: int,
        private _borderMaxStepLen: double,

        private _sheetStepsDefault: int,
        private _sheetMaxStrutsLen: double,

        private _outerRadius: double,
        private _outerLength: double,

        private _innerRadius: double,
        private _innerLength: double,

        private _axisSize: double,
        private _axisStretchZ: double,

        private _cameraRadius: double
    ) {
    }



    static defaultParms(): TooledTunnelParms01 {
        return new TooledTunnelParms01(
            BORDER_ANGLE,
            BORDER_ANGLE_ROTATE,
            BORDER_STEPS_DEFAULT,
            MAXSTEPLEN,

            SHEET_STEPS_DEFAULT,
            MAXSTRUTLEN,

            OUTERRADIUS,
            OUTERLENGTH,

            INNERRADIUS,
            INNERLENGTH,

            AXIS_SIZE,
            AXIS_STRETCH_Z,

            CAMERA_RADIUS
        );
    }




    get borderAngle(): double {
        return this._borderAngle;
    }




    set borderAngle( value: double ) {
        this._borderAngle = value;
    }




    get borderAngleRotate(): double {
        return this._borderAngleRotate;
    }




    set borderAngleRotate( value: double ) {
        this._borderAngleRotate = value;
    }




    get borderStepsDefault(): int {
        return this._borderStepsDefault;
    }




    set borderStepsDefault( value: int ) {
        this._borderStepsDefault = value;
    }




    get borderMaxStepLen(): double {
        return this._borderMaxStepLen;
    }




    set borderMaxStepLen( value: double ) {
        this._borderMaxStepLen = value;
    }




    get sheetStepsDefault(): int {
        return this._sheetStepsDefault;
    }




    set sheetStepsDefault( value: int ) {
        this._sheetStepsDefault = value;
    }




    get sheetMaxStrutsLen(): double {
        return this._sheetMaxStrutsLen;
    }




    set sheetMaxStrutsLen( value: double ) {
        this._sheetMaxStrutsLen = value;
    }




    get outerRadius(): double {
        return this._outerRadius;
    }




    set outerRadius( value: double ) {
        this._outerRadius = value;
    }




    get outerLength(): double {
        return this._outerLength;
    }




    set outerLength( value: double ) {
        this._outerLength = value;
    }




    get innerRadius(): double {
        return this._innerRadius;
    }




    set innerRadius( value: double ) {
        this._innerRadius = value;
    }




    get innerLength(): double {
        return this._innerLength;
    }




    set innerLength( value: double ) {
        this._innerLength = value;
    }




    get axisSize(): double {
        return this._axisSize;
    }




    set axisSize( value: double ) {
        this._axisSize = value;
    }




    get axisStretchZ(): double {
        return this._axisStretchZ;
    }




    set axisStretchZ( value: double ) {
        this._axisStretchZ = value;
    }




    get cameraRadius(): double {
        return this._cameraRadius;
    }




    set cameraRadius( value: double ) {
        this._cameraRadius = value;
    }
}
