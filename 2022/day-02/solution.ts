import { readFile } from "fs/promises";

export function solve(input: string): any {
  // Your solution goes here...
}

if (!Bun.argv[2]) {
  console.error("Input not specified.");
} else {
  try {
    readFile(Bun.argv[2], "utf-8")
      .then((input) => {
        solve(input);
      })
      .catch((error) => {
        console.error("Error reading input: " + error);
      });
  } catch (error) {
    console.error("Error reading input: " + error);
  }
}