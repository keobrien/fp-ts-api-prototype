import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { respond400, respond401, respond500, respond503 } from "../http/responses";
import { log, maybeObjKey, objKey } from "../utils";
import { pipe } from "fp-ts/lib/function";
import { Errors, Validation } from "../types";
import { Event } from "@netlify/functions/dist/function/event";
const apiKeys = require("../../data/api-keys.json");

export {
    // utils
    multipleValidations,
    multipleValidations400,
    testingServerErrorCodes,
    // generic fields
    hasRequiredBodyField,
    isRequiredFieldType,
    hasRequiredStringField,
    isFieldStringMatch,
    isPasswordMatch,
    // query paraters
    hasRequiredQueryParam,
    validateRequiredQueryParam,
    // api keys
    validateApiKey,
}

//======================== Start implementation

const multipleValidations = (response: Function) => (checks: Validation) => (input: any) => 
    pipe(
        checks,
        A.flap(input),
        A.lefts,
        A.flatten,
        result => result.length > 0 ? E.left(response(result)) : E.right(input)
    );

const multipleValidations400 = multipleValidations(respond400);

const hasRequiredBodyField = (field: string) => (event: Event) =>
    pipe(
        event,
        maybeObjKey(`body.${field}`),
        E.fromOption(() => [{ key: 'missing-field', field: field, developer_details: `Request is missing required field: ${field}.` }]),
    );

const isRequiredFieldType = (field: string) => (type: string) => (event: Event) =>
    pipe(
        event,
        hasRequiredBodyField(field),
        E.chain(value => typeof value === type
            ? E.right(event)
            : E.left([{ key: 'incorrect-field-type', field: field, developer_details: `Field is is not a '${type}', it is a '${typeof value}' with the value ${JSON.stringify(value)}.` }])),
        E.match(
            errors => E.left(errors),
            _ => E.right(event)
        )
    );

const hasRequiredStringField = (field: string) => isRequiredFieldType(field)('string');

const isFieldStringMatch = 
    (pattern: RegExp, errorDetails?: object, errorKey?: string) => 
        (field: string) => 
            (event: Event) =>
                pipe(
                    event,
                    hasRequiredStringField(field),
                    E.chain(event => E.right(objKey(`body.${field}`)(event))),
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

const hasRequiredQueryParam = (field: string) => (event: Event) =>
    pipe(
        event,
        maybeObjKey(`queryStringParameters.${field}`),
        O.match(
            () => E.left([{ key: 'missing-query-param', field: field, developer_details: `Request is missing required query parameter: ${field}.` }]),
            () => E.right(event)
        )
    );

const validateRequiredQueryParam = (field: string) => (event: Event) =>
    pipe(
        event,
        hasRequiredQueryParam(field),
        E.match(
            errors => E.left(respond400(errors)),
            () => E.right(event)
        )
    );

const testingServerErrorCodes = (event: Event) =>
    pipe(
        maybeObjKey(`headers.x-api-key`)(event),
        O.match(
            () => E.right(''),
            key => E.right(key)
        ),
        E.chain(key => key === 'TEST-MAINTINANCE'
            ? E.left(respond503())
            : E.right(key)
        ),
        E.chain(key => key === 'TEST-SERVER-ERROR'
            ? E.left(respond500())
            : E.right(key)
        ),
        E.match(
            result => E.left(result),
            () => E.right(event)
        )
    );

const validateApiKey = (event: Event) =>
    pipe(
        maybeObjKey(`headers.x-api-key`)(event),
        O.match(
            () => E.left([{ key: 'missing-api-key', developer_details: 'An api key was not provided.' }]),
            key => E.right(key)
        ),
        E.map(key => { console.info(key); return key; }),
        E.chain(key => apiKeys.includes(key)
            ? E.right(event)
            : E.left([{ key: 'invalid-api-key', developer_details: 'The api key provided is not valid.' }])
        ),
        E.match(
            errors => E.left(respond401(errors)),
            () => E.right(event)
        )
    );


const isPasswordMatch = (pattern: RegExp, errorDetails?: object, errorKey?: string) => 
    isFieldStringMatch(pattern, errorDetails, errorKey)('password');