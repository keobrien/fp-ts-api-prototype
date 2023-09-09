import { Handler } from "@netlify/functions";
import { handleHttpMethods } from "./utils/utils";

export const handler: Handler = handleHttpMethods({})