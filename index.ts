import { mkdir, writeFile } from "fs/promises";

import { existsSync } from "fs";
import { join } from "path";

const sessionCookie = process.env.SESSION_COOKIE;

switch (Bun.argv[2]) {
  case "new":
    scaffold(Number(Bun?.argv[3]), Number(Bun?.argv[4]));
    break;
  default:
    console.error("...What am I supposed to do?");
    break;
}

async function scaffold(year?: number, day?: number): Promise<void> {
  if (!day && !year) {
    day = Number(
      new Date().toLocaleString("en-US", {
        timeZone: "EST",
        day: "numeric",
      })
    );

    year = Number(
      new Date().toLocaleString("en-US", {
        timeZone: "EST",
        year: "numeric",
      })
    );
  }

  // make sure it's december EST if day and year aren't provided
  if (
    new Date().toLocaleString("en-US", {
      timeZone: "EST",
      month: "numeric",
    }) !== "12"
  ) {
    console.error("Current month (EST)/month provided is not December.");
    return;
  }

  // if the year is invalid
  if (year! > new Date().getFullYear() || year! < 2015) {
    console.error("Current year/year provided is invalid.");
    return;
  }

  // make sure the day is valid
  if (
    day! > 25 ||
    day! < 1 ||
    (year === new Date().getFullYear() &&
      day! >
        Number(
          new Date().toLocaleString("en-US", {
            timeZone: "EST",
            day: "numeric",
          })
        ))
  ) {
    console.error("Current day/day provided is invalid.");
    return;
  }

  const dayPath = join(String(year), `day-${String(day).padStart(2, "0")}`);
  const solutionPath = join(dayPath, "solution.ts");

  console.info(`🎄 Scaffolding for ${year} challenge ${day}... 🎄`);
  // create the files and directories
  try {
    mkdir(dayPath, {
      recursive: true,
    });

    if (!existsSync(solutionPath)) {
      writeFile(
        solutionPath,

        `import { readFile } from "fs/promises";

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
}`
      );
    }

    writeFile(
      join(dayPath, "solution.test.ts"),
      `import { expect, test } from "bun:test";

import { solve } from "./solution";

// Fill in the test data below

const testInput = \`\`;

const testAnswer = ;

test("Provided Example", () => {
  expect(solve(testInput)).toBe(testAnswer);
});
    `
    );

    // if the user didn't provide the cookie, don't provide input
    if (sessionCookie) {
      const input = await fetch(
        `https://adventofcode.com/${year}/day/${day}/input`,
        {
          headers: {
            Cookie: `session=${sessionCookie}`,
          },
        }
      ).then((i) => i.text());

      writeFile(join(dayPath, "input.txt"), input);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.info("🎅 Finished successfully. 🎅");
  console.info(
    `✨ Go into the ${dayPath} directory to continue (cd ${dayPath}). ✨`
  );
}
