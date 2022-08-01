import { Handler } from "@netlify/functions";
import { chain, match, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond200, respond401 } from "../http/responses";
import { httpMethods, isJson } from "../http/request-validation";
import { attr, decodeBody, hasRequiredStringField, multipleValidations400 } from "../utils";
import { Event } from "@netlify/functions/dist/function/event";
import { users } from "../data/users";

const findUser = (event: Event) =>{
    const username = attr('body.username')(event);
    const password = attr('body.password')(event);
    const user = users.find(user => user.username === username && user.password === password);
    return user
        ? right(user)
        : left(respond401([{ key: 'user-not-found', developer_details: `username "${username}" and password combination not found.` }]));
}


const handler: Handler = async (event: Event, context) =>
    httpMethods(event, {
        post: () => pipe(
            right(event),
            chain(isJson),
            chain(decodeBody),
            chain(multipleValidations400([
                hasRequiredStringField('username'),
                hasRequiredStringField('password'),
            ])),
            chain(findUser),
            match(
                (error) => error,
                user => respond200({ access_token: user.access_token })
            )
        )
    });

export { handler };