import { Handler } from "@netlify/functions";
import { chain, match, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond200 } from "../http/responses";
import { httpMethods, isJson } from "../http/request-validation";
import { decodeBody, hasRequiredStringField, isPasswordMatch, multipleValidations400 } from "../utils";
import { findUser } from "../users/users";


const handler: Handler = async (event, _) =>
    httpMethods(event, {
        post: () => pipe(
            right(event),
            chain(isJson),
            chain(decodeBody),
            chain(
                multipleValidations400([
                    hasRequiredStringField('username'),
                    isPasswordMatch(/[a-z]/, { min: 1 }, 'password-lower'),
                    isPasswordMatch(/[A-Z]/, { min: 1 }, 'password-upper'),
                    isPasswordMatch(/[0-9]/, { min: 1 }, 'password-number'),
                    isPasswordMatch(/[^a-zA-Z0-9\s]/, { min: 1 }, 'password-special-character'),
                    isPasswordMatch(/.{15,30}/, { min: 15, max: 30 }, 'password-length'),
                ])
            ),
            chain(findUser),
            match(
                (error) => error,
                user => respond200({ access_token: user.access_token })
            )
        )
    });

export { handler };