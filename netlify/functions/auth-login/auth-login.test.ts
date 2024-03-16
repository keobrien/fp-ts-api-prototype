import 'jest';
import * as E from "fp-ts/lib/Either";
import { authenticateUser } from '../auth-login/auth-login';
import users from "../../data/users.json";

export default {};

/**
 * Tests auth-login
 */
 describe('Box', () => {
    test('result', () => {
        const request = mockApiRequest();
        request.body = {
            username: 'mockUser1',
            password: 'example'
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
