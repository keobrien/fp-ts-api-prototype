import { pipe } from "fp-ts/lib/function";
import * as E from 'fp-ts/Either';
import * as A from "fp-ts/lib/Array";

export const eitherCheckPasswordAdd = (password:any): Array<string> =>
pipe(
    E.of(password),
    E.chain(requirePasswordString),
    E.chain(multipleValidations([
        requirePasswordMin10,
        requirePasswordMax25,
        requireRegExpMatch(/[a-z]{2,}/, 'Password have at least 2 or more lowercase letters.'),
        requireRegExpMatch(/[A-Z]{2,}/, 'Password have at least 2 or more upper letters.'),
        requireRegExpMatch(/[^a-zA-Z\d]{2,}/, 'Password have at least 2 or more special characters.'),
        requireRegExpMatch(/[\d]{2,}/, 'Password have at least 2 or more numbers.'),
    ])),
    E.match(
        (errors) => errors,
        () => []
    )
);

// Utils ============================
const isString = (value:any): Boolean => typeof value === 'string';
const hasMinStringLength = (minLength:any): Function => (value:string): Boolean => value.length >= minLength;
const hasMaxStringLength = (maxLength:any): Function => (value:string): Boolean => value.length <= maxLength;
const hasXOrMoreStringMatches = (match:RegExp): Function => (value:string): Boolean => match.test(value);
const requirePasswordString = (value:any) => isString(value) ? E.right(value) : E.left(['Password is required.']);
const requirePasswordMin10 = (value:string) => hasMinStringLength(10)(value) ? E.right(value) : E.left(['Password must be at least 10 characters long.'])
const requirePasswordMax25 = (value:string) => hasMaxStringLength(25)(value) ? E.right(value) : E.left(['Password must not be longer than 25 characters.'])
const requireRegExpMatch = (match:RegExp, message:string) => (value:string) => hasXOrMoreStringMatches(match)(value) ? E.right(value) : E.left([message])
const multipleValidations = (checks: Array<Function>) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        (result:Array<string>) => result.length > 0 ? E.left(result) : E.right(input)
    );