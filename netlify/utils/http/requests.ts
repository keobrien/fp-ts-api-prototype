import * as O from 'fp-ts/Option';
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond400, respond404NotFound } from "./responses";
import { Event } from "@netlify/functions/dist/function/event";
import { maybeObjKey } from "../utils";
import { Handlers } from "../types";

export {
    isJson,
    handleHttpMethods
}

//======================== Start implementation

const isJson = (event: Event) =>
    pipe(
        maybeObjKey('headers.content-type')(event),
        O.chain(type => type === 'application/json' ? O.some(type) : O.none),
        E.fromOption(
            () => respond400([{ 
                key: 'unavailable-content-type',
                developer_details: `The content type requested is not available.`
            }])
        ),
        E.chain(_ => E.right(event))
    );

const handleHttpMethods = (event: Event, handlers:Handlers) => 
    pipe(
        E.right(event),
        E.chain(event => E.right(event.httpMethod.toLowerCase())),
        E.chain((httpMethod) =>
            handlers.hasOwnProperty(httpMethod)
                ? E.left(handlers[httpMethod as keyof Handlers])
                : E.right(httpMethod)),
        E.match(
            found => found(),
            _ => respond404NotFound
        )
    )