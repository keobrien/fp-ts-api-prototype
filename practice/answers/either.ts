import { pipe } from "fp-ts/lib/function";
import * as E from 'fp-ts/Either';
import * as A from "fp-ts/lib/Array";

export const eitherCheckPasswordAdd = (password:any): Array<string> =>
pipe(
    E.of(password),
    E.chain(requirePasswordString),
    E.chain(multipleValidations([
        minLength10,
        maxLength25,
        min2LowerLetters,
        min2UpperLetters,
        min2SpecialCharacters,
        min2Numbers,
    ])),
    E.match(
        (errors) => errors,
        () => []
    )
);

// Utils ============================
const isString = (value:any): Boolean => 
    typeof value === 'string';

const hasMinStringLength = (minLength:any): Function =>
    (value:string): Boolean =>
        value.length >= minLength;

const hasMaxStringLength = (maxLength:any): Function =>
    (value:string): Boolean => 
        value.length <= maxLength;

const hasXOrMoreStringMatches = (match:RegExp): Function =>
    (value:string): Boolean =>
        match.test(value);

const requirePasswordString = (value:any) =>
    isString(value)
        ? E.right(value)
        : E.left(['Password is required.']);

const minLength10 = (input) =>
    hasMinStringLength(10)(input)
        ? E.right(input)
        : E.left(['Password must be at least 10 characters long.']);
    
const maxLength25 = (input) =>
    hasMaxStringLength(25)(input)
        ? E.right(input)
        : E.left(['Password must not be longer than 25 characters.']);

const min2LowerLetters = (input) =>
    requireRegExpMatch(/[a-z]{2,}/, 'Password have at least 2 or more lowercase letters.')(input);

const min2UpperLetters = (input) =>
    requireRegExpMatch(/[A-Z]{2,}/, 'Password have at least 2 or more upper letters.')(input);

const min2SpecialCharacters = (input) =>
    requireRegExpMatch(/[^a-zA-Z\d]{2,}/, 'Password have at least 2 or more special characters.')(input);

const min2Numbers = (input) =>
    requireRegExpMatch(/[\d]{2,}/, 'Password have at least 2 or more numbers.')(input);

const requireRegExpMatch = (match:RegExp, message:string) =>
    (value:string) =>
        hasXOrMoreStringMatches(match)(value)
            ? E.right(value)
            : E.left([message]);

const multipleValidations = (checks: Array<Function>) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        (result:Array<string>) => result.length > 0 ? E.left(result) : E.right(input)
    );