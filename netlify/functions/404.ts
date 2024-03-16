import { Handler } from "@netlify/functions";
import { handleHttpMethods } from "@custom/netlify-api-utils";

export const handler: Handler = handleHttpMethods({})