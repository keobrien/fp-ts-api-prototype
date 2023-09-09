import type { HandlerEvent } from "@netlify/functions";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { respond400, respond401, respond500, respond503 } from "./responses";
import { maybeObjKey, objKey } from "./utils";
import { pipe } from "fp-ts/lib/function";
import { Validation } from "./types";

export {
    // utils
    multipleValidations,
    multipleValidations400,
    // generic fields
    requiredStringField,
    isRegExMatch
}

//======================== Start implementation

const multipleValidations = (response: Function) => (checks: Validation) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        result => result.length > 0
            ? E.left(response(result))
            : E.right(input)
    );

const multipleValidations400 = multipleValidations(respond400);

const requiredField = (field: string) => (event: HandlerEvent) =>
    pipe(
        event,
        maybeObjKey(field),
        E.fromOption(() => [{ key: 'missing-field', field: field, developer_details: `Request is missing required field: ${field}.` }]),
    );

const requiredFieldOfType = (field: string) => (type: string) => (event: HandlerEvent) =>
    pipe(
        event,
        requiredField(field),
        E.chain(value => typeof value === type
            ? E.right(event)
            : E.left([{ key: 'incorrect-field-type', field: field, developer_details: `Field is is not a '${type}', it is a '${typeof value}' with the value ${JSON.stringify(value)}.` }])),
        E.match(
            errors => E.left(errors),
            _ => E.right(event)
        )
    );

const requiredStringField = (field: string) => requiredFieldOfType(field)('string');

const isRegExMatch = 
    (pattern: RegExp, errorDetails?: object, errorKey?: string) => 
        (field: string) => 
            (event: HandlerEvent) =>
                pipe(
                    event,
                    requiredStringField(field),
                    E.chain(event => E.right(objKey(field)(event))),
                    E.chain(value => 
                        value.match(pattern) !== null
                            ? E.right(event)
                            : E.left([{
                                key: errorKey ? errorKey :'incorrect-format',
                                developer_details: `The field '${field}' did not match the format '${pattern}' for the value '${value}'`,
                                field,
                                error_details: errorDetails}])
                    )
                );