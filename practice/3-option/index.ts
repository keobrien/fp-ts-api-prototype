import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

// New: Currying
//   fancyAddSix = maybeAdd(6);
//   fancyAddSix(8); // equals "Your number is: 14"
// Todo:
// - Only accepts even numbers
// - Numbers must be greater than 5
// - Numbers must be greater less than 50
// - Should return the string "Your number is: X" or "Cannot add"
export const fancyAdd = (first:any): Function =>
    (second:any): string =>
        '';

// Utils ============================