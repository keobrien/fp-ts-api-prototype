import type { HandlerResponse } from "@netlify/functions";
import { ErrorResponse, ErrorResponseData, ErrorResponseHandler, Errors, SuccessResponse, SuccessResponseData } from "./types";

export {
    respond,
    respond200,
    respondWithErrors,
    respond400,
    respond401,
    respond403,
    respond404,
    respond500,
    respond503,
    error,
}

//======================== Start implementation
const error = (error:ErrorResponse) => error;

const respond = (statusCode:number) => (content:(SuccessResponseData|ErrorResponseData)): HandlerResponse => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            ...content,
            server_info: { version: process.env.npm_package_version }
        }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    };
}

const respondWithErrors = (statusCode:number):ErrorResponseHandler =>
    (errors:Errors = []):ErrorResponse => 
        respond(statusCode)({ errors: errors });

const respond200 = (content: Object):SuccessResponse =>
    respond(200)({ data: content });

const respond400 = respondWithErrors(400);
const respond401 = respondWithErrors(401);
const respond403 = respondWithErrors(403);
const respond404 = respondWithErrors(404);
const respond500 = respondWithErrors(500);
const respond503 = respondWithErrors(503);
