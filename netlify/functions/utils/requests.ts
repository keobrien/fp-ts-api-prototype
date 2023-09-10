import type { HandlerEvent } from "@netlify/functions";
import * as O from 'fp-ts/Option';
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond400, respond404 } from "./responses";
import { ErrorResponse, NormalizedHandlerEvent } from "./types";

export {
    processPostRequest,
    handleHttpMethods
}

//======================== Start implementation

const processPostRequest = (event: HandlerEvent): E.Either<ErrorResponse, NormalizedHandlerEvent> =>
    pipe(
        E.right(event),
        E.chain(isAllowedType),
        E.chain(decodeBody),
    );

const isAllowedType = (event: HandlerEvent): E.Either<ErrorResponse, HandlerEvent> =>
    pipe(
        event?.headers['content-type'] || '',
        normalizeContentTypeHeader,
        O.chain( maybeStringIncludes('application/json') ),
        O.chain( maybeStringIncludes('charset=utf-8') ),
        O.match(
            () => E.left(respond400([{ 
                key: 'unavailable-content-type',
                developer_details: `The content type requested is not available.`
            }])),
            result => E.right(event)
        ),
    );

const normalizeContentTypeHeader = (header: string): O.Option<string> =>
    typeof header === 'string'
    && header.length > 0
        ? O.some(header.toLocaleLowerCase())
        : O.none;

const maybeStringIncludes = (expected: string) => (fullString: string): O.Option<string> =>
    fullString.includes(expected)
        ? O.some(fullString)
        : O.none;

const decodeBody = (event: HandlerEvent): E.Either<ErrorResponse, NormalizedHandlerEvent> =>
    E.tryCatch(
        () => { event.body = JSON.parse(event.body); return event },
        error => respond400([{ key: 'request-body-json', developer_details: `Unable to parse request body json: ${error}` }])
    );

const handleHttpMethods = (handlers) => async (event: HandlerEvent) => 
    pipe(
        E.right(event),
        E.chain(event => E.right(event.httpMethod.toLowerCase())),
        E.chain((httpMethod) =>
            handlers.hasOwnProperty(httpMethod)
                ? E.right(handlers[httpMethod])
                : E.left(event)
        ),
        E.match(
            _ => respond404([
                { key: 'api-not-found', developer_details: 'API endpoint not found.' }
            ]),
            found => found(event)
        )
    );