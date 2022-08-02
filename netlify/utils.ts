import { option } from "fp-ts";
import { tryCatch } from "fp-ts/lib/Either";

import * as C from "fp-ts/lib/Console";
import { respond400 } from "./http/responses";
import { Event } from "@netlify/functions/dist/function/event";

export const mapLog = (x: any) => { C.log(x)(); return x; };
export const log = (value: any) => { console.info(value); return value; }

export const objKey = (path: string) => (object: Object) => {
    return path.split('.').reduce((parts: any, part: string): any => {
        return (parts && (parts[part] !== undefined)) ? parts[part] : undefined;
    }, object);
}

export const maybeObjKey = (path: string) => (object: Object) => {
    const result = objKey(path)(object);
    return result ? option.some(result) : option.none;
}


export const decodeBody = (event: Event) =>
    tryCatch(
        () => { event.body = JSON.parse(event.body); return event },
        error => respond400([{ key: 'request-body-json', developer_details: `Unable to parse request body json: ${error}` }])
    );

