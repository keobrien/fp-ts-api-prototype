import 'jest';
import { add, maybeAdd } from '.';
import * as O from 'fp-ts/Option';

/**
 * Tests Option
 * 
 * @group mapChain
 */
 describe('Basic Add', () => {
    test('add: 0 + 1', () => {
        expect(add(0, 1)).toBe(1);
    });

    test('add: "0" + 1', () => {
        expect(add('0', 1)).toBe('01');
    });

    test('add: "a" + 1', () => {
        expect(add('a', 1)).toBe('a1');
    });

    test('add: {} + 1', () => {
        expect(add({}, 1)).toBe('[object Object]1');
    });

    test('add: [] + 1', () => {
        expect(add({}, 1)).toBe('[object Object]1');
    });

    test('add: NaN + 1', () => {
        expect(add(NaN, 1)).toBe(NaN);
    });

    test('add: ()=>{} + 1', () => {
        expect(add(()=>{}, 1)).toBe('() => { }1');
    });
});

describe('Maybe Add', () => {
    test('maybeAdd: 0 + 1', () => {
        expect(maybeAdd(0, 1)).toStrictEqual(O.some(1));
    });

    test('maybeAdd: "0" + 1', () => {
        expect(maybeAdd('0', 1)).toStrictEqual(O.none);
    });

    test('maybeAdd: "a" + 1', () => {
        expect(maybeAdd('a', 1)).toStrictEqual(O.none);
    });

    test('maybeAdd: {} + 1', () => {
        expect(maybeAdd({}, 1)).toStrictEqual(O.none);
    });

    test('maybeAdd: [] + 1', () => {
        expect(maybeAdd([], 1)).toStrictEqual(O.none);
    });

    test('maybeAdd: NaN + 1', () => {
        expect(maybeAdd(NaN, 1)).toStrictEqual(O.none);
    });

    test('maybeAdd: ()=>{} + 1', () => {
        expect(maybeAdd(()=>{}, 1)).toStrictEqual(O.none);
    });
});