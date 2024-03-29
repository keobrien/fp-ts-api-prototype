/**
 * Tests Option
 * 
 * @group either
 */

import 'jest';
import { eitherCheckPasswordAdd } from './index';

describe('Either check password', () => {
    test('eitherCheckPasswordAdd: 0', () => {
        expect(eitherCheckPasswordAdd(0)).toStrictEqual([ 'Password is required.' ]);
    });

    test('eitherCheckPasswordAdd: {}', () => {
        expect(eitherCheckPasswordAdd({})).toStrictEqual([ 'Password is required.' ]);
    });

    test('eitherCheckPasswordAdd: []', () => {
        expect(eitherCheckPasswordAdd({})).toStrictEqual([ 'Password is required.' ]);
    });

    test('eitherCheckPasswordAdd: NaN', () => {
        expect(eitherCheckPasswordAdd(NaN)).toStrictEqual([ 'Password is required.' ]);
    });

    test('eitherCheckPasswordAdd: ()=>{}', () => {
        expect(eitherCheckPasswordAdd(()=>{})).toStrictEqual([ 'Password is required.' ]);
    });

    test('eitherCheckPasswordAdd: null', () => {
        expect(eitherCheckPasswordAdd(()=>{})).toStrictEqual([ 'Password is required.' ]);
    });

    test('eitherCheckPasswordAdd: min length ok', () => {
        expect(eitherCheckPasswordAdd('aaaaaaaaaa')).toEqual(expect.not.arrayContaining(['Password must be at least 10 characters long.']));
    });

    test('eitherCheckPasswordAdd: min length not ok', () => {
        expect(eitherCheckPasswordAdd('aaaaaaaaa')).toEqual(expect.arrayContaining(['Password must be at least 10 characters long.']));
    });

    test('eitherCheckPasswordAdd max length ok', () => {
        expect(eitherCheckPasswordAdd('aaaaaaaaaaaaaaaaaaaaaaaaa')).toEqual(expect.not.arrayContaining(['Password must not be longer than 25 characters.']));
    });

    test('eitherCheckPasswordAdd max length not ok', () => {
        expect(eitherCheckPasswordAdd('aaaaaaaaaaaaaaaaaaaaaaaaaa')).toEqual(expect.arrayContaining(['Password must not be longer than 25 characters.']));
    });

    test('eitherCheckPasswordAdd: multiple short', () => {
        expect(eitherCheckPasswordAdd('a')).toEqual(expect.arrayContaining([
            'Password must be at least 10 characters long.',
            'Password have at least 2 or more lowercase letters.',
            'Password have at least 2 or more upper letters.',
            'Password have at least 2 or more special characters.',
            'Password have at least 2 or more numbers.'
        ]));
    });

    test('eitherCheckPasswordAdd: multiple long', () => {
        expect(eitherCheckPasswordAdd('aaaaaaaaaaaaaaaaaaaaaaaaaa')).toEqual(expect.arrayContaining([
            'Password must not be longer than 25 characters.',
            'Password have at least 2 or more upper letters.',
            'Password have at least 2 or more special characters.',
            'Password have at least 2 or more numbers.'
        ]));
    });

    test('eitherCheckPasswordAdd: success', () => {
        expect(eitherCheckPasswordAdd('aaaaAA11..')).toStrictEqual([]);
    });
});