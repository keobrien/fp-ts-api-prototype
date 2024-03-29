import type { Handler, HandlerEvent } from "@netlify/functions";
import { chain, match, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { faker } from '@faker-js/faker';
import { error, handleHttpMethods, multipleValidations400, objKey, processPostRequest, requiredStringField, respond200, respond401 } from "./utils/utils";
import { NormalizedHandlerEvent, User } from "./utils/types";
import users from "./data/users.json";

export const handler: Handler = handleHttpMethods({
    post: (event: HandlerEvent) => pipe(
        event,
        processPostRequest,
        chain(
            multipleValidations400([
                requiredStringField('body.username'),
                requiredStringField('body.password'),
            ])
        ),
        chain(authenticateUser),
        match(
            error,
            user => respond200({
                profile: {
                    id: user.id,
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName()
                },
                access_token: user.access_token,
                refresh_token: faker.string.alphanumeric(16)
            })
        )
    )
});

export const authenticateUser = (event: NormalizedHandlerEvent) => {
    const username = objKey('body.username')(event);
    const password = objKey('body.password')(event);
    const user:User = users.find((user: User) =>
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