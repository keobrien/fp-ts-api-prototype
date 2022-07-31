import { flow, pipe } from "fp-ts/lib/function";
import { mapLog } from "../utils";

export declare type Response = {
    statusCode: number;
    body: string;
}

const respond = (statusCode:number) => (content:Object): Response => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            content,
            server_info: {
                version: process.env.npm_package_version,
            }
        }),
    };
}

export declare type Error = {
    key: string,
    developer_details: string;
}
export declare type Errors = Array<Error>;

const respondWithErrors = (statusCode:number) => (errors:Errors) => 
    pipe(
        errors,
        () => respond(statusCode)({
            errors: errors
        })
    )

export const respond200 = respond(200);
export const respond400 = respondWithErrors(400);
export const respond401 = respondWithErrors(401);
export const respond404 = respondWithErrors(404);
export const respond404NotFound = respondWithErrors(404)([{ key: 'not-found', developer_details: 'API endpoint not found.' }]);