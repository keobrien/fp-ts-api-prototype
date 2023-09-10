import { Errors, Response } from "./types";

export {
    respond,
    respond200,
    respond400,
    respond401,
    respond403,
    respond404,
    respond500,
    respond503,
    error,
}

//======================== Start implementation
const error = (error: Response) => error;

const respond = (statusCode:number) => (content:any = {}): Response => {
    content.server_info = {
        version: process.env.npm_package_version
    };
    return {
        statusCode: statusCode,
        body: JSON.stringify(content),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
    };
}

const respondWithErrors = (statusCode:number) =>
    (errors:Errors = []) => 
        respond(statusCode)({ errors: errors });

const respond200 = (content: Object) =>
    respond(200)({ data: content });

const respond400 = respondWithErrors(400);
const respond401 = respondWithErrors(401);
const respond403 = respondWithErrors(403);
const respond404 = respondWithErrors(404);
const respond500 = respondWithErrors(500);
const respond503 = respondWithErrors(503);
