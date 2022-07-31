import { Handler } from "@netlify/functions";
import { chain, match, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond200 } from "../http/responses";
import { httpMethods, isJson } from "../http/request-validation";
import { decodeBody, multipleValidations400 } from "../utils";
import { Event } from "@netlify/functions/dist/function/event";

const handler: Handler = async (event: Event, context) =>
    httpMethods(event, {
        post: () => pipe(
            right(event),
            chain(isJson),
            chain(multipleValidations400([
                _ => left([{key: 'test', developer_details: 'test'}]),
                _ => left([{key: 'test2', developer_details: 'test2'}])
            ])),
            chain(decodeBody),
            match(
                (error) => error,
                _ => respond200({ message: "Hello World" })
            )
        )
    });

export { handler };