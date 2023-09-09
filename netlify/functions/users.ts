import { Handler } from "@netlify/functions";
import { chain, match, right, left } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { handleHttpMethods, hasRequiredStringField, isPasswordMatch, multipleValidations400, objKey, processPostRequest, respond200 } from "../utils/utils";
import { User } from "../utils/types";
const users = require("../data/users.json");

export const handler: Handler = handleHttpMethods({
    post: (event) => pipe(
        right(event),
        chain(processPostRequest),
        chain(
            multipleValidations400([
                hasRequiredStringField('username'),
                hasRequiredStringField('password'),
                isPasswordMatch(/[a-z]/, { min: 1 }, 'password-lower'),
                isPasswordMatch(/[A-Z]/, { min: 1 }, 'password-upper'),
                isPasswordMatch(/[0-9]/, { min: 1 }, 'password-number'),
                isPasswordMatch(/[^a-zA-Z0-9\s]/, { min: 1 }, 'password-special-character'),
                isPasswordMatch(/.{15,30}/, { min: 15, max: 30 }, 'password-length'),
                uniqueUsername,
            ])
        ),
        match(
            (error) => error,
            event => respond200({
                'id': 0
            })
        )
    )
});

const uniqueUsername = (event: Event) =>
    users.find((user: User) => user.username === objKey('body.username')(event))
        ? left([{ key: 'username-not-unique', field: 'username', developer_details: `Username must be unique.` }])
        : right(event);