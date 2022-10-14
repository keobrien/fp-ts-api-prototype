import { Either } from "fp-ts/lib/Either";

export declare type Error = {
    key: string,
    developer_details: string;
    field?: string,
    error_details?: object
}
export declare type Errors = Array<Error>;

export declare type Validation = Array<(a: any) => Either<Errors, any>>;

export declare type Response = {
    statusCode: number;
    body?: string;
    headers?: { [header: string]: string | number | boolean; }
}

export declare type Handler = () => Response;

export interface Handlers {
    post?: Handler;
    get?: Handler;
    put?: Handler;
    patch?: Handler;
    delete?: Handler;
}