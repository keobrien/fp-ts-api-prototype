import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

// Todo:
// - Only accepts even numbers
// - Numbers must be greater than 5
// - Numbers must be less than 50
// - Add the numbers together
// - Return the string "Your number is: X" or "Cannot add"
export const fancyAdd = (first:any): Function =>
    (second:any): string =>
    pipe(
        O.of([first, second]),
        O.chain(allAreNumbers),
        O.chain(allEven),
        // More steps needed.
        O.match(
            () => '',
            value => ''
        )
    );

// Utils ============================
const allAreNumbers = (arrayOfNumbers:Array<any>): O.Option<Array<number>> => O.none;
const allEven = () => O.none;