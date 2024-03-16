import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { respond400, respond401, respond404 } from "./responses";
import { maybeObjKey, objKey } from "./find";
import { flow, pipe } from "fp-ts/lib/function";
import { ErrorResponse, ErrorResponseHandler, Errors, NormalizedHandlerEvent, Validator, Validators } from "./types";

export {
    // utils
    validateAll,
    validateAllOrRespond400,
    validateAllOrRespond401,
    validateAllOrRespond404,
    // generic fields
    requiredStringField,
    isRegExMatch
}

//======================== Start implementation

const validateAll =
    (checks:Validators) =>
        (data:any):E.Either<Errors,any> => 
            pipe(
                checks,
                A.flap(data),
                A.lefts,
                A.flatten,
                result => result.length > 0
                    ? E.left(result)
                    : E.right(data)
            );

const validateAllResponse = (response:ErrorResponseHandler) =>
    (checks: Validators) =>
        (data: any):E.Either<ErrorResponse,any> => 
            pipe(
                validateAll(checks)(data),
                E.match(
                    errors => E.left(response(errors)),
                    () =>  E.right(data)
                )
            );

const validateAllOrRespond400 = validateAllResponse(respond400);
const validateAllOrRespond401 = validateAllResponse(respond401);
const validateAllOrRespond404 = validateAllResponse(respond404);

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