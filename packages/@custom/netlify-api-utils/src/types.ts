import type { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { Either } from "fp-ts/lib/Either";

export declare type Error = {
    key: string,
    developer_details: string;
    field?: string,
    error_details?: object
}
export declare type Errors = Array<Error>;

export declare type Validator = (data: any) => Either<Errors, any>;
export declare type Validators = Validator[];
export declare type ValidationHandler = (errors:Errors) => ErrorResponse;

export interface SuccessResponse extends HandlerResponse {}
export interface ErrorResponse extends HandlerResponse {}

export interface SuccessResponseData<Data = {}> {
    data: Data
}
export interface ErrorResponseData {
    errors: Errors
}

export interface NormalizedHandlerEvent extends Omit<HandlerEvent, 'body'> {
    body: Object
}