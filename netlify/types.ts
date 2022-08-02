import { Either } from "fp-ts/lib/Either";

export declare type Error = {
    key: string,
    developer_details: string;
    field?: string,
    error_details?: object
}
export declare type Errors = Array<Error>;

export declare type Validation = Array<(a: any) => Either<Errors, any>>;