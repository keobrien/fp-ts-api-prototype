import type { Handler, HandlerEvent } from "@netlify/functions";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { handleHttpMethods, isRegExMatch, multipleValidations400, objKey, processPostRequest, requiredStringField, respond200, NormalizedHandlerEvent, User } from "@custom/netlify-api-utils";
const users = require("../../data/users.json");

export const handler:Handler = handleHttpMethods({
    post: (event: HandlerEvent) => pipe(
        event,
        processPostRequest,
        E.chain(
            multipleValidations400([
                requiredStringField('body.username'),
                requiredStringField('body.password'),
            ])
        ),
        E.chain(
            multipleValidations400([
                isPasswordMatch(/[a-z]{2,}/, { min: 2 }, 'password-lower'),
                isPasswordMatch(/[A-Z]/, { min: 1 }, 'password-upper'),
                isPasswordMatch(/[0-9]/, { min: 1 }, 'password-number'),
                isPasswordMatch(/[^a-zA-Z0-9\s]/, { min: 1 }, 'password-special-character'),
                isPasswordMatch(/.{15,30}/, { min: 15, max: 30 }, 'password-length'),
                uniqueUsername,
            ])
        ),
        E.match(
            (error) => error,
            _ => respond200({
                'id': 0
            })
        )
    )
});

const isPasswordMatch = (pattern: RegExp, errorDetails?: object, errorKey?: string) => 
    isRegExMatch(pattern, errorDetails, errorKey)('body.password');

const uniqueUsername = (event: NormalizedHandlerEvent) =>
    users.find((user: User) => user.username === objKey('body.username')(event))
        ? E.left([{ key: 'username-not-unique', field: 'username', developer_details: `Username must be unique.` }])
        : E.right(event);