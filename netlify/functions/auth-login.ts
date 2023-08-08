import { Handler } from "@netlify/functions";
import { chain, left, match, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { User } from "./users";
import { decodeBody, handleHttpMethods, hasRequiredStringField, isJson, multipleValidations400, objKey, respond200, respond401, testingServerErrorCodes, validateApiKey } from "../utils/utils";
const users = require("../data/users.json");

export const handler: Handler = async (event, _) =>
    handleHttpMethods(event, {
        post: () => pipe(
            right(event),
            chain(testingServerErrorCodes),
            chain(validateApiKey),
            chain(isJson),
            chain(decodeBody),
            chain(
                multipleValidations400([
                    hasRequiredStringField('username'),
                    hasRequiredStringField('password'),
                ])
            ),
            chain(findUsernamePasswordMatch),
            match(
                (error) => error,
                user => respond200({ access_token: user.access_token })
            )
        )
    });

const findUsernamePasswordMatch = (event: Event) =>{
    const username = objKey('body.username')(event);
    const password = objKey('body.password')(event);
    const user = users.find((user: User) => user.username === username && user.password === password);
    return user
        ? right(user)
        : left(respond401([{
            key: 'user-not-found',
            developer_details: `username "${username}" and password combination not found.`
        }]));
}