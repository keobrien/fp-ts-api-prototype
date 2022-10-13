import { either } from "fp-ts";
import * as O from 'fp-ts/Option';
import { chain, match } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond400, respond404NotFound, Response } from "./responses";
import { Event } from "@netlify/functions/dist/function/event";
import { maybeObjKey } from "../utils";

declare type Handler = () => Response;

interface Handlers {
    post?: Handler;
    get?: Handler;
    put?: Handler;
    delete?: Handler;
}

export const isJson = (event: Event) =>
    pipe(
        maybeObjKey('headers.content-type')(event),
        O.chain(type => type === 'application/json' ? O.some(type) : O.none),
        either.fromOption(
            () => respond400([{ 
                key: 'unavailable-content-type',
                developer_details: `The content type requested is not available.`
            }])
        ),
        chain(_ => either.right(event))
    );

export const httpMethods = (event: Event, handlers:Handlers) => 
    pipe(
        either.right(event),
        chain(event => either.right(event.httpMethod.toLowerCase())),
        chain((httpMethod) =>
            handlers.hasOwnProperty(httpMethod)
                ? either.left(handlers[httpMethod as keyof Handlers])
                : either.right(httpMethod)),
        match(
            found => found(),
            _ => respond404NotFound
        )
    )