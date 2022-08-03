import { Handler } from "@netlify/functions";
import { chain, match, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { respond200 } from "../http/responses";
import { httpMethods, isJson } from "../http/request-validation";
import { decodeBody } from "../utils";
import { findUser } from "../users/users";
import { hasRequiredStringField, multipleValidations400 } from "../validation/validation";

const handler: Handler = async (event, _) =>
    httpMethods(event, {
        post: () => pipe(
            right(event),
            chain(isJson),
            chain(decodeBody),
            chain(
                multipleValidations400([
                    hasRequiredStringField('username'),
                    hasRequiredStringField('password'),
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