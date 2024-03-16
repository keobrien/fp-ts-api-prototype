import type { HandlerEvent } from "@netlify/functions";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { faker } from '@faker-js/faker';
import { error, handleHttpMethods, objKey, processPostRequest, requiredStringField, respond200, respond401, NormalizedHandlerEvent, ErrorResponse, validateAllOrRespond400 } from "@custom/netlify-api-utils";
import users from "../../data/users.json";
import { User, UserProfile } from "../../types";

export const handler = handleHttpMethods({
    post: (event: HandlerEvent) => pipe(
        event,
        processPostRequest,
        E.chain(validateAllOrRespond400([
            requiredStringField('body.username'),
            requiredStringField('body.password'),
        ])),
        E.chain(authenticateUser),
        E.map(generateLoginDetails),
        E.match(
            error,
            respond200
        )
    )
});

interface LoginSuccessResponse {
    profile: UserProfile;
    access_token: string;
    refresh_token: string;
}

const generateLoginDetails = (user:User):LoginSuccessResponse => 
    ({
        profile: {
            id: user.id,
            username: user.username,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName()
        },
        access_token: user.access_token,
        refresh_token: faker.string.alphanumeric(16)
    })

export const authenticateUser = (event:NormalizedHandlerEvent):E.Either<ErrorResponse,User> => {
    const username = objKey('body.username')(event);
    const password = objKey('body.password')(event);
    const user:User = users.find((user: User) =>
        user.username === username
        && user.password === password
    );
    
    return user
        ? E.right(user)
        : E.left(respond401([{
            key: 'user-not-found',
            developer_details: `username "${username}" and password combination not found.`
        }]));
}