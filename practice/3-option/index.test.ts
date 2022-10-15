/**
 * Tests Option
 * 
 * @group option
 */

import 'jest';
import { fancyAdd } from './index';
// import { fancyAdd } from '../answers/option';

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