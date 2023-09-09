import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { chain, left, match, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { handleHttpMethods, hasRequiredStringField, multipleValidations400, objKey, processPostRequest, respond200, respond401 } from "../utils/utils";
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
            ])
        ),
        chain(authenticateUser),
        match(
            (error) => error,
            user => respond200({ user })
        )
    )
});

const authenticateUser = (event: Event) => {
    const username = objKey('body.username')(event);
    const password = objKey('body.password')(event);
    const user = users.find((user: User) =>
        user.username === username
        && user.password === password
    );
    
    return user
        ? right(user)
        : left(respond401([{
            key: 'user-not-found',
            developer_details: `username "${username}" and password combination not found.`
        }]));
}