import { either } from "fp-ts";
import { left, right, match, chain } from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { respond400 } from "../http/responses";
import { maybeObjKey, objKey } from "../utils";
import { pipe } from "fp-ts/lib/function";
import { Validation } from "../types";

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
        maybeObjKey(`body.${field}`),
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
    (pattern: RegExp, errorDetails?: object, errorKey?: string) => 
        (field: string) => 
            (event: Event) =>
                pipe(
                    event,
                    hasRequiredStringField(field),
                    chain(event => right(objKey(`body.${field}`)(event))),
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