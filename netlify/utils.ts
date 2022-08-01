import { either, option } from "fp-ts";
import { tryCatch, Either, left, right, match, chain, map } from "fp-ts/lib/Either";
import * as C from "fp-ts/lib/Console";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { Errors, respond400 } from "./http/responses";
import { Event } from "@netlify/functions/dist/function/event";
import { pipe } from "fp-ts/lib/function";

export const mapLog = (x: any) => { C.log(x)(); return x; };
export const log = (value: any) => { console.info(value); return value; }

export const attr = (path: string) => (object: Object) => {
    return path.split('.').reduce((parts: any, part: string): any => {
        return (parts && (parts[part] !== undefined)) ? parts[part] : undefined;
    }, object);
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


const hasRequiredField = (field: string) => (event: Event) =>
    pipe(
        event,
        maybeAttr(`body.${field}`),
        either.fromOption(() => [{ key: 'missing-field', field: field, developer_details: `Request is missing required field: ${field}.` }]),
    );

export const isRequiredFieldType = (field: string) => (type: string) => (event: Event) =>
    pipe(
        event,
        hasRequiredField(field),
        chain(value => typeof value === type
            ? right(event)
            : left([{ key: 'incorrect-field-type', field: field, developer_details: `Field is is not a '${type}', it is a '${typeof value}' with the value ${JSON.stringify(value)}.` }])),
        match(
            errors => left(errors),
            _ => right(event)
        )
    );

export const hasRequiredStringField = (field: string) => isRequiredFieldType(field)('string')