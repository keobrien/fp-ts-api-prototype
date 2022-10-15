import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

export const fancyAdd = (first:any): Function =>
    (second:any): string =>
        pipe(
            O.of([first, second]),
            O.chain(allAreNumbers),
            O.chain(allEven),
            O.chain(allMoreThan5),
            O.chain(allLessThan50),
            O.map(addAll),
            O.match(
                () => 'Cannot add',
                (value) => `Your number is: ${value}`
            )
        )

// Utils ============================

const isOdd = (number:number): Boolean => (number % 2) === 1;

const allEven = (arrayOfNumbers: Array<number>): O.Option<Array<number>> =>
    arrayOfNumbers.find(isOdd) !== undefined
        ? O.none
        : O.some(arrayOfNumbers);

const allMoreThan5 = (arrayOfNumbers: Array<number>) => 
    arrayOfNumbers.every((number): Boolean => number > 5)
        ? O.some(arrayOfNumbers)
        : O.none

const allLessThan50 = (arrayOfNumbers: Array<number>) => 
    arrayOfNumbers.every((number): Boolean => number < 50)
        ? O.some(arrayOfNumbers)
        : O.none;

const add = (first:any, second:any): any =>
    first + second;

const isNotNumber = (number:any): Boolean =>
    (typeof number !== 'number') || Number.isNaN(number);

const allAreNumbers = (arrayOfNumbers:Array<any>): O.Option<Array<number>> =>
    arrayOfNumbers.findIndex(isNotNumber) === -1 ? O.some(arrayOfNumbers) : O.none;
    
const addAll = (arrayOfNumbers:Array<number>): number =>
    arrayOfNumbers.reduce(add);