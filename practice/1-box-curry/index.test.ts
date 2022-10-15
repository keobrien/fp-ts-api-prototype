import 'jest';

export const introToBox = (x: number) =>
    new Box(x)
        .map((one: number) => one + 1)          // 2
        .map((two: number) => { console.info('Testing: ' + two); return two })
        .map((two: number) => two + 2)          // 4
        .map(addOne)                            // 5 Same as .map(five => addOne(five)) returns 6
        .map(addTwo)                            // 7
        .map((seven: number) => addN(1)(seven)) // 8 addN(1) returns function(seven) { return 1 + seven; } which return 8
        .map(addN(1))                           // 9 Also returns function(seven) { return 1 + seven; } which gets passed eight and returns nine
        .map(addThree)                          // 12
        .unbox((result: number) => result);

/**
 * Tests Option
 * 
 * @group boxCurry
 */
 describe('Box', () => {
    test('result', () => {
        expect(introToBox(1)).toBe(12);
    });
});


// Utils ============================

const addOne = (x: number) => x + 1;
// Example: Above is the arrow function syntax, it's the same as below:
// function addOne(x: number) {
//     return x + 1;
// }

const addTwo = (x: number) => x + 2;

const addN = (x: number) => (n: number) => x + n;
// Example: Above is a curried function, it's the same as below:
// function addN(n: number) {
//     return function(x: number) {
//         return x + n;
//     }
// }

const addThree = addN(3); // returns a function addThree(1) passes 1 to addN with n=3

class Box {
    public value;

    constructor(value: number) {
        this.value = value;
    }

    map = (fn: Function) =>
        new Box(fn(this.value));

    unbox = (fn: Function) =>
        fn(this.value)
}
