import { either, option } from "fp-ts";
import { tryCatch, Either, left, right, match, chain, map } from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
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

declare type Validation = Array<(a: any) => Either<Errors, any>>;

export const multipleValidations = (checks: Validation) => (response: Function) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        result => result.length > 0 ? left(response(result)) : right(input)
    );

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

export const hasRequiredStringField = (field: string) => isRequiredFieldType(field)('string');

export const isFieldStringMatch = 
    (pattern: RegExp, errorDetails?: object, errorKey: string) => 
        (field: string) => 
            (event: Event) =>
                pipe(
                    event,
                    hasRequiredStringField(field),
                    chain(event => right(attr(`body.${field}`)(event))),
                    chain(value => 
                        value.match(pattern) !== null
                            ? right(event)
                            : left([{
                                key: errorKey ? errorKey :'incorrect-format',
                                developer_details: `The field '${field}' did not match the format '${pattern}' for the value '${value}'`,
                                field,
                                error_details: errorDetails}])
                    )
                );

export const isPasswordMatch = (pattern: RegExp, errorDetails?: object, errorKey?: string) => 
    isFieldStringMatch(pattern, errorDetails, errorKey)('password');