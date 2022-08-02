import { left, right } from "fp-ts/lib/Either";
import { respond401 } from "../http/responses";
import { attr } from "../utils";

export const users = [
    { id: 0, username: "test", password: "test", access_token: "test" },
];

export const findUser = (event: Event) =>{
    const username = attr('body.username')(event);
    const password = attr('body.password')(event);
    const user = users.find(user => user.username === username && user.password === password);
    return user
        ? right(user)
        : left(respond401([{
            key: 'user-not-found',
            developer_details: `username "${username}" and password combination not found.`
        }]));
}