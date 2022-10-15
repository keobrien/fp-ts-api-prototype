import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

export const add = (first:any, second:any): any =>
    first + second;

// New: pipe()
// New: Option and some() vs none, sometimes refered to as Maybe with just() vs none
// New: chain vs map vs match
export const maybeAdd = (first:any, second:any): O.Option<number> =>
    // Pipe takes the first agument, passed it as an argument to the second argument function, passes the reulst of that to the 3rd, etc.
    pipe(
        // Of wraps the value in a Option some() or none
        O.of([first, second]),
        // chain unpacks the maybe and passes the value, requires returing a new Option, allowing switching between some() and none.
        // O.chain(value => { console.info(value); return O.some(value); }),
        O.chain(allAreNumbers),
        // map also unpacks the maybe and passes the value, puts return value back in the to a some() type.
        // O.map(value => { console.info(value); return value; }),
        O.map(addAll),
        // O.match(                     // Example only, not needed, can modify the end result.
        //     () => O.none,            // none callback
        //     (value) => O.some(value) // some callback
        // )
    )

// Utils ============================

export const isNotNumber = (number:any): Boolean =>
    (typeof number !== 'number') || Number.isNaN(number);

export const allAreNumbers = (arrayOfNumbers:Array<any>): O.Option<Array<number>> =>
    arrayOfNumbers.findIndex(isNotNumber) === -1 ? O.some(arrayOfNumbers) : O.none;

export const addAll = (arrayOfNumbers:Array<number>): number =>
    arrayOfNumbers.reduce(add);