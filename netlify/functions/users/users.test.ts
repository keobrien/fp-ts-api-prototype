import 'jest';
import { handler } from './users';
import { mockEvent } from '@custom/netlify-jest-mocks';

export default {};

/**
 * Tests auth-login
 */
 describe('Box', () => {
    test('result', async () => {
        const event = mockEvent({
            httpMethod: 'POST',
            body: JSON.stringify({
                username: 'test2',
                password: 'TEst1234!@#$aaa'
            })
        });
        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe("{\"data\":{\"id\":0},\"server_info\":{\"version\":\"0.0.1\"}}");
    });
});
