import 'jest';
import { introToBox } from './index';

/**
 * Tests Option
 * 
 * @group boxCurry
 */
 describe('Box', () => {
    test('result', () => {
        expect(introToBox(5)).toBe(14);
    });
});