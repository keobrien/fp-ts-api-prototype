import { option } from "fp-ts";
import * as E from "fp-ts/lib/Either";
import * as C from "fp-ts/lib/Console";
import { respond400 } from "./http/responses";
import { Event } from "@netlify/functions/dist/function/event";

export * from "./http/requests";
export * from "./http/responses";
export * from "./validation/validation";
export {
    mapLog,
    log,
    objKey,
    maybeObjKey,
    decodeBody
}

//======================== Start implementation

const mapLog = (x: any) => { C.log(x)(); return x; };
const log = (value: any) => { console.info(value); return value; }

const objKey = (path: string) => (object: Object) => {
    return path.split('.').reduce((parts: any, part: string): any => {
        return (parts && (parts[part] !== undefined)) ? parts[part] : undefined;
    }, object);
}

const maybeObjKey = (path: string) => (object: Object) => {
    const result = objKey(path)(object);
    return result ? option.some(result) : option.none;
}


const decodeBody = (event: Event) =>
    E.tryCatch(
        () => { event.body = JSON.parse(event.body); return event },
        error => respond400([{ key: 'request-body-json', developer_details: `Unable to parse request body json: ${error}` }])
    );

