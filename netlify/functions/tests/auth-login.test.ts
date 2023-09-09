import 'jest';
import * as E from "fp-ts/lib/Either";
import { authenticateUser } from '../auth-login';
import users from "../data/users.json";

/**
 * Tests auth-login
 */
 describe('Box', () => {
    test('result', () => {
        const request = mockApiRequest();
        request.body = {
            username: 'admin',
            password: 'pass123'
        }
        const result = authenticateUser(request);
        
        expect(JSON.stringify(result))
            .toBe(JSON.stringify(E.right(users[0])));
    });
});

const mockApiRequest = () => {
    return {
        rawUrl: '',
        rawQuery: '',
        path: '',
        httpMethod: '',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: {},
        isBase64Encoded: true,
        multiValueQueryStringParameters: {},
        body: {}
    }
}
