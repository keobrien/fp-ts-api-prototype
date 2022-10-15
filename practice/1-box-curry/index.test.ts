import 'jest';

export const introToBox = (x: number) =>
    new Box(x)
        .map((one:number) => one + 1)          // 2
        .map((two:number) => two + 2)          // 4
        .map(addOne)                           // 5
        .map(addTwo)                           // 7
        .map((seven:number) => addN(1)(seven)) // 8
        .map(addN(1))                          // 9
        .map(addThree)                         // 12
        .unbox((result: number) => result);

/**
 * Tests Option
 * 
 * @group box
 */
 describe('Box', () => {
    test('result is 1', () => {
        expect(introToBox(1)).toBe(12);
    });
});


// =======================================

const addOne = (x: number) => x + 1;
// function addOne(x: number) {
//     return x + 1;
// }

const addTwo = (x: number) => x + 2;

const addN = (x: number) => (n: number) => x + n;
// function addN(n: number) {
//     return function(x: number) {
//         return x + n;
//     }
// }

const addThree = addN(3); // returns a function addThree(1) passes 1 to addN with n=3

class Box {
    public x;

    constructor(x: number) {
        this.x = x;
    }

    map = (fn: Function) =>
        new Box(fn(this.x));

    unbox = (fn: Function) =>
        fn(this.x)
}
