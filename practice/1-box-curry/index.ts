export const introToBox = (x: number) =>
    Box.of(x)
        .map( double )      // Box with 10
        .map( add(20) )     // Box with 30
        .map( subtract(2) ) // Box with 28
        .map( divideBy(2) ) // Box with 14
        .unbox();           // number 14


// Utils ============================

const double = (x: number) => x * 2;
// Example: Above is the arrow function syntax, it's the same as below:
// function double(x: number) {
//     return x * 2;
// }

const add = (x: number) => (y: number) => x + y;
// Example: Above is a curried function, it's the same as below:
// function add(y: number) {
//     return function(x: number) {
//         return x + y;
//     }
// }

const addThree = add(3); // returns a function addThree(1) passes 1 to addN with n=3

const subtract = (x: number) => (y: number)  => y - x;

const divideBy = (x: number) => (y: number)  => y / x;

class Box {
    public value;

    constructor(value: number) {
        this.value = value;
    }

    static of = (value: number) =>
        new Box(value);

    map = (fn: Function) =>
        new Box(fn(this.value));

    unbox = () =>
        this.value
}