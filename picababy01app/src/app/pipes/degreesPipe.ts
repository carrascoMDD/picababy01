import { Pipe, PipeTransform } from '@angular/core';
/*
 * Returns as degrees the value given in radians
 * Usage:
 *   value | degrees
 * Example:
 *   {{ 3.141592 | degrees }}
 *   formats to: 180 (approx)
*/
@Pipe({name: 'degrees'})
export class DegreesPipe implements PipeTransform {
    transform(theRadians: number): number {
        return theRadians * 180 /  Math.PI;
    }
}
