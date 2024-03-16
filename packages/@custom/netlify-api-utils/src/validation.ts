import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { respond400 } from "./responses";
import { maybeObjKey, objKey } from "./find";
import { pipe } from "fp-ts/lib/function";
import { NormalizedHandlerEvent, ValidationHandler, Validators } from "./types";

export {
    // utils
    multipleValidations,
    multipleValidations400,
    // generic fields
    requiredStringField,
    isRegExMatch
}

//======================== Start implementation

const multipleValidations = (response:ValidationHandler) =>
    (checks: Validators) =>
        (data: any) => 
            pipe(
                checks,
                A.flap(data),
                A.lefts,
                A.flatten,
                result => result.length > 0
                    ? E.left(response(result))
                    : E.right(data)
            );

const multipleValidations400 = multipleValidations(respond400);

const requiredField = (field: string) => (event: NormalizedHandlerEvent) =>
    pipe(
        event,
        maybeObjKey(field),
        E.fromOption(() => [{ key: 'missing-field', field: field, developer_details: `Request is missing required field: ${field}.` }]),
    );

const requiredFieldOfType = (field: string) => (type: string) => (event: NormalizedHandlerEvent) =>
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
            (event: NormalizedHandlerEvent) =>
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