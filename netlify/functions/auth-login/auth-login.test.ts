import 'jest';
import * as E from "fp-ts/lib/Either";
import { authenticateUser } from '../auth-login/auth-login';
import users from "../../data/users.json";
import { mockEvent } from '@custom/netlify-jest-mocks';

export default {};

/**
 * Tests auth-login
 */
 describe('Box', () => {
    test('result', () => {
        const request = mockEvent({
            body: {
                username: 'mockUser1',
                password: 'example'
            }
        });
        const result = authenticateUser(request);
        
        expect(JSON.stringify(result))
            .toBe(JSON.stringify(E.right(users[0])));
    });
});
