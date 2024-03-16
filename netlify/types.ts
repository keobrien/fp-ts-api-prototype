export declare type User = {
    id: number;
    username: string;
    password: string;
    access_token: string;
}

export interface UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}