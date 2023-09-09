import { option } from "fp-ts";

export * from "./requests";
export * from "./responses";
export * from "./validation";
export {
    log,
    objKey,
    maybeObjKey
}

//======================== Start implementation
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

