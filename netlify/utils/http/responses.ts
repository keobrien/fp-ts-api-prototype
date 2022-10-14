import { Errors, Response } from "../types";
const packageJson = require("../../../package.json");

export {
    respond200,
    respond400,
    respond401,
    respond403,
    respond404,
    respond500,
    respond503,
    respond404NotFound
}

//======================== Start implementation

const respond = (statusCode:number) => (content:any = null): Response => {
    if(content === null) return { statusCode: statusCode };
    content.server_info = { version: packageJson.version };
    return {
        statusCode: statusCode,
        body: JSON.stringify(content),
        headers: { 'Content-Type': 'application/json' },
    };
}

const respondWithErrors = (statusCode:number) => (errors:Errors = null) => 
    errors ? respond(statusCode)({ errors }) : respond(statusCode)();

const respond200 = (content: Object) => respond(200)({ data: content });
const respond400 = respondWithErrors(400);
const respond401 = respondWithErrors(401);
const respond403 = respondWithErrors(403);
const respond404 = respondWithErrors(404);
const respond500 = respondWithErrors(500);
const respond503 = respondWithErrors(503);
const respond404NotFound = respondWithErrors(404)([{ key: 'api-not-found', developer_details: 'API endpoint not found.' }]);