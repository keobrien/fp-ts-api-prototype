import type { HandlerEvent } from "@netlify/functions";
import { Either } from "fp-ts/lib/Either";

export declare type Error = {
    key: string,
    developer_details: string;
    field?: string,
    error_details?: object
}
export declare type Errors = Array<Error>;

export declare type Validators = Array<(data: any) => Either<Errors, any>>;

export declare type Response = {
    statusCode: number;
    body?: string;
    headers?: { [header: string]: string | number | boolean; }
}
export interface SuccessResponse extends Response {}
export interface ErrorResponse extends Response {}

export declare type User = {
    id: number;
    username: string;
    password: string;
    access_token: string;
}

export interface NormalizedHandlerEvent extends Omit<HandlerEvent, 'body'> {
    body: Object
}