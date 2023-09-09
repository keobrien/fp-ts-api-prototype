import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as A from "fp-ts/lib/Array";

/**
 * Todo: implement these password rules:
 * - Required to be a string or return [ 'Password is required.' ]
 * - 'Password is required.' should be checked first and returned alone, all other errors can be 
 *   returned individually or have multiple errors in the array.
 * - Require at least 10 characters long or return [ 'Password must be at least 10 characters long.' ]
 * - Require no more than 25 characters long or return [ 'Password must not be longer than 25 characters.' ]
 * - Require 2 or more lowercase letters [ 'Password have at least 2 or more lowercase letters.' ]
 * - Require 2 or more upper letters [ 'Password have at least 2 or more upper letters.' ]
 * - Require 2 or more special characters (any non-letter, non-number) [ 'Password have at least 2 or 
 *   more special characters.' ]
 * - Require 2 or more numbers [ 'Password have at least 2 or more numbers.' ]
 * - A successful response should be []
 * 
 * @param password 
 * @returns {Array} Array of all error strings, or empty Array
 */
export const eitherCheckPasswordAdd = (password:any): Array<string> =>
    pipe(
        E.right(password),
        E.chain(EXAMPLE_SUCCESS),
        E.map(log),
        E.chain(EXAMPLE_ERROR),
        E.chain(multipleValidations([
            EXAMPLE_ERROR,
            EXAMPLE_ERROR
        ])),
        E.match(
            (errors) => errors,
            () => []
        )
    );

// Utils ============================

const EXAMPLE_ERROR = (input:any) => E.left(['Fix me.']);
const EXAMPLE_SUCCESS = (input:any) => E.right(input);
const log = (input:any) => { console.info(input); return input };

const multipleValidations = (checks: Array<Function>) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        (result:Array<string>) =>
            result.length > 0
                ? E.left(result)
                : E.right(input)
    );