import { Handler } from "@netlify/functions";
import { Event } from "@netlify/functions/dist/function/event";
import { respond404NotFound } from "../utils/utils";

const handler: Handler = async (even: Event, _) =>
    respond404NotFound;

export { handler };