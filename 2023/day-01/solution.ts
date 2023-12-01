import { readFile } from "fs/promises";

export function solve(input: string): any {
  // Your solution goes here...
}

if (Bun.argv[2]) {
  readFile(Bun.argv[2], "utf-8")
    .then((input) => {
      solve(input);
    })
    .catch((error) => {
      console.error("Error reading input: " + error);
    });
} else {
  readFile("input.txt", "utf-8")
    .then((input) => {
      solve(input);
    })
    .catch((error) => {
      console.error("Error reading input: " + error);
    });
}
