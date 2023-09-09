# Overview

Practice problems to learn about Either Left and Right.

## Prerequisite
1. Follow readme in root project.
1. I've included a helper function `multipleValidations` for accumulating multiple Lefts into one array. If there are 1 or more Lefts, they will be merged into a single Left with an array of all the strings. If only Rights are returned, it returns a Right with the original input.

## What to do
1. In `index.ts` the function `eitherCheckPasswordAdd()` is incomplete and has failing unit tests, follow the todo steps to make all tests pass.
1. In the root directory, run `npm run test:either` from inside this folder.
1. Once the `eitherCheckPasswordAdd` unit tests all pass, you're done!
1. (Optional) check the answers folder to see how I solved it.

## Resources
1. [fp-ts Option](https://gcanti.github.io/fp-ts/modules/Option.ts.html).
1. [Practical Guide to Fp-ts P2: Option, Map, Flatten, Chain](https://rlee.dev/practical-guide-to-fp-ts-part-2) covers more than what is in the practice.