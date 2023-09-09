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

export declare type User = {
    username: string;
    password: string;
    access_token: string;
}