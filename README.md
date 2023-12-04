> ℹ️ **Notice:** This project does comply to the AoC [automation rules](https://www.reddit.com/r/adventofcode/wiki/faqs/automation/#wiki_automated_tools). It should (🤞) be safe to use.

# Advent of Code TypeScript Template

I made this starter script to streamline the process of preparing and testing my
entries into the 2023 Advent of Code (my first year). I found some of the other ones confusing, so I made my own. It is relatively simple and somewhat opinionated, but feel free to change anything for yourself. This project uses the [Bun Runtime](https://bun.sh) for package management, execution and testing. 🩵

## Setup and run

To start, clone this repo and then run `bun install` (assuming you have Bun installed already).

### Scaffold for new challenge

Simply run any one of `bun run new`, `bun run scaffold`, or `bun run init` (you can actually drop the "run", `bun new` works the same). By default, it will use the current date (EST) to determine which challenge to set up, but you can specify a different challenge by passing in CLI arguments (e.g. `bun run new 2022 1`).

> **ℹ️ Automatically downloading input files**
>
> In order to automatically download the input file for your specific challenge, you must provide your AoC session cookie in the `SESSION_COOKIE` environment variable. If you don't provide this, everything else will work, but you will not be able to automatically download the input file as they are each unique and associated with your account.

### Test solution

In order to test your solution, you must input the test data and test answer in `part-1.test.ts`/`part-1.test.ts` where specified. Assuming you are in the corresponding directory for a challenge (i.e. 2023/day-01), you can run `bun test` to run the test(s). To run the test for one specific challenge, simply run
`bun test part-1` or `bun test part-2`. You can also use the shorthand of `bun test 1` and `bun test 2`.

### Complete challenge

Again, making sure you are in the corresponding directory for a challenge, simply run either `bun solve-1` or `bun solve-2` to output the return value of either one of your solutions when provided with the input (sourced from `in.txt`). You can also use the shorthand of `bun 1` and `bun 2`.
