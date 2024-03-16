import * as O from 'fp-ts/Option';

export {
    objKey,
    maybeObjKey
}

const objKey = (path: string) => (object: Object) => {
    return path.split('.').reduce((parts: any, part: string): any => {
        return (parts && (parts[part] !== undefined)) ? parts[part] : undefined;
    }, object);
}

const maybeObjKey = (path: string) => (object: Object) => {
    const result = objKey(path)(object);
    return result ? O.some(result) : O.none;
}