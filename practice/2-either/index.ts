import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as A from "fp-ts/lib/Array";

/**
 * Traditional validation with conditionals
 * 
 * Password rules are:
 * - Required to be a string or return [ 'Password is required.' ]
 * - Require at least 10 characters long or return [ 'Password must be at least 10 characters long.' ]
 * - Require no more than 25 characters long or return [ 'Password must not be longer than 25 characters.' ]
 * - Require 2 or more lowercase letters [ 'Password have at least 2 or more lowercase letters.' ]
 * - Require 2 or more upper letters [ 'Password have at least 2 or more upper letters.' ]
 * - Require 2 or more special characters (any non-letter, non-number) [ 'Password have at least 2 or more special characters.' ]
 * - Require 2 or more numbers [ 'Password have at least 2 or more numbers.' ]
 * - 'Password is required.' should be checked first and returned alone, all other errors can be returned indivisually or have multiple errors in the array.
 * - A successful response should be []
 **/
export const checkPassword = (password:any): any => {

    const errors = [];

    if(!isString(password)) {
        errors.push('Password is required.');
        return errors;
    }

    if(!hasMinStringLength(10)(password)) {
        errors.push('Password must be at least 10 characters long.');
    }

    if(!hasMaxStringLength(25)(password)) {
        errors.push('Password must not be longer than 25 characters.');
    }

    if(!hasXOrMoreStringMatches(/[a-z]{2,}/)(password)) {
        errors.push('Password have at least 2 or more lowercase letters.');
    }

    if(!hasXOrMoreStringMatches(/[A-Z]{2,}/)(password)) {
        errors.push('Password have at least 2 or more upper letters.');
    }

    if(!hasXOrMoreStringMatches(/[^a-zA-Z\d]{2,}/)(password)) {
        errors.push('Password have at least 2 or more special characters.');
    }

    if(!hasXOrMoreStringMatches(/[\d]{2,}/)(password)) {
        errors.push('Password have at least 2 or more numbers.');
    }

    return errors;

}

/**
 * New:
 * - Either with Left or Right works a lot like Option except the error side (none / Left) can hold
 *   values.
 * - If a Left is retruned, later E.chain and E.map calls will be skipped.
 * - If an E.right is returned, later E.chain and E.map calls will run.
 * 
 * Todo:
 * - Recreate the validation with Either
 * - I've included a helper function `multipleValidations` for accumulating multiple Lefts into one array.
 *   This takes an array of functions that return an Either Left or Right. All Lefts with a arrays of strings
 *   will be merged into a single Left with an array of all the strings.
 * 
 * @param password 
 * @returns {Array} Array of all error strings, or empty Array
 */
export const eitherCheckPasswordAdd = (password:any): Array<string> =>
    pipe(
        E.right(password),
        E.chain(EXAMPLE_SUCESS),
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

const EXAMPLE_ERROR = (_:any) => E.left(['Fix me.']);
const EXAMPLE_SUCESS = (a:any) => E.right(a);
const log = (a:any) => { console.info(a); return a };
export const isString = (value:any): Boolean => typeof value === 'string';
export const hasMinStringLength = (minLength:any): Function => (value:string): Boolean => value.length >= minLength;
export const hasMaxStringLength = (maxLength:any): Function => (value:string): Boolean => value.length <= maxLength;
export const hasXOrMoreStringMatches = (match:RegExp): Function => (value:string): Boolean => match.test(value);

export const multipleValidations = (checks: Array<Function>) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        (result:Array<string>) => result.length > 0 ? E.left(result) : E.right(input)
    );