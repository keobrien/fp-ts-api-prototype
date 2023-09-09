import type { HandlerEvent } from "@netlify/functions";
import * as O from 'fp-ts/Option';
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond400, respond404NotFound } from "./responses";
import { maybeObjKey } from "./utils";

export {
    processPostRequest,
    handleHttpMethods
}

//======================== Start implementation

const processPostRequest = (event: HandlerEvent) =>
    pipe(
        E.right(event),
        E.chain(isJson),
        E.chain(decodeBody)
    )

const isJson = (event: HandlerEvent) =>
    pipe(
        maybeObjKey('headers.content-type')(event),
        O.chain(type =>
            type === 'application/json'
                ? O.some(type)
                : O.none
        ),
        E.fromOption(
            () => respond400([{ 
                key: 'unavailable-content-type',
                developer_details: `The content type requested is not available.`
            }])
        ),
        E.chain(_ => E.right(event))
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
            _ => respond404NotFound,
            found => found(event)
        )
    )

const decodeBody = (event: HandlerEvent) =>
    E.tryCatch(
        () => { event.body = JSON.parse(event.body); return event },
        error => respond400([{ key: 'request-body-json', developer_details: `Unable to parse request body json: ${error}` }])
    );