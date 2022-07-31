import { either, option } from "fp-ts";
import { tryCatch, Either, left, right, match } from "fp-ts/lib/Either";
import * as C from "fp-ts/lib/Console";
import { Errors, respond400 } from "./http/responses";
import { Event } from "@netlify/functions/dist/function/event";

export const mapLog = (x: any) => { C.log(x)(); return x; };

const attr = (path: string) => (object: Object) => {
    return path.split('.').reduce((parts: any, part: string): any => {
        return (parts && (parts[part] !== undefined)) ? parts[part] : option.none;
    }, object)
}

export const maybeAttr = (path: string) => (object: Object) => {
    const result = attr(path)(object);
    return result ? option.some(result) : option.none;
}


export const decodeBody = (event: Event) =>
    tryCatch(
        () => { event.body = JSON.parse(event.body); return event },
        error => respond400([{ key: 'request-body-json', developer_details: `Unable to parse request body json: ${error}` }])
    );

declare type Validation = Array<(a: any) => Either<Errors, Event>>;

const runValidations = (checks: Validation) => (input: any) =>
    checks
        .map((check: Function) => check(input))
        .map(match(
            (errors: Errors) => errors,
            (_: any): Errors => [],
        ))
        .reduce((result: Errors, item: Errors) => [...result, ...item]);

export const multipleValidations = (checks: Validation) => (response: Function) => (input: any) => {
    const result = runValidations(checks)(input);
    return result.length > 0
        ? left(response(result))
        : right(input);
}

export const multipleValidations400 = (checks: Validation) =>
    multipleValidations(checks)(respond400);