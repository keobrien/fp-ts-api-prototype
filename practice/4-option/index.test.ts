/**
 * Tests Option
 * 
 * @group option
 */

import 'jest';
import { add, maybeAdd, fancyAdd } from './index';
import * as O from 'fp-ts/Option';
// import { fancyAdd } from "../answers/option";

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

describe('Facy Add', () => {
    test('fancyAdd: 6 + 8', () => {
        expect(fancyAdd(6)(8)).toStrictEqual('Your number is: 14');
    });

    test('fancyAdd: "0" + 6', () => {
        expect(fancyAdd('0')(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: "a" + 6', () => {
        expect(fancyAdd(6)('a')).toStrictEqual('Cannot add');
    });

    test('fancyAdd: {} + 6', () => {
        expect(fancyAdd({})(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: [] + 6', () => {
        expect(fancyAdd(6)([])).toStrictEqual('Cannot add');
    });

    test('fancyAdd: NaN + 6', () => {
        expect(fancyAdd(NaN)(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: ()=>{} + 6', () => {
        expect(fancyAdd(()=>{})(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: 2 + 6', () => {
        expect(fancyAdd(2)(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: 7 + 6', () => {
        expect(fancyAdd(7)(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: 5 + 6', () => {
        expect(fancyAdd(5)(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: -6 + 6', () => {
        expect(fancyAdd(-6)(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: 50 + 6', () => {
        expect(fancyAdd(50)(6)).toStrictEqual('Cannot add');
    });

    test('fancyAdd: 48 + 6', () => {
        expect(fancyAdd(48)(6)).toStrictEqual('Your number is: 54');
    });
});