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

  console.info(`\n🎄 Scaffolding for ${year} Advent of Code day ${day}...\n`);
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
  // Your code goes here...
  
}

if (Bun.argv[2] === "solve") {
  readFile(Bun.argv[3], "utf-8")
    .then((inputFile) => {
      solve(inputFile);
    })
    .catch((error) => {
      console.error("Error reading input: " + error);
    });
}

`
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
    const inputPath = join(dayPath, "input.txt");

    if (sessionCookie && !existsSync(inputPath)) {
      console.info("ℹ️  Downloading input...");

      await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
          Cookie: `session=${sessionCookie}`,
          "User-Agent":
            "https://github.com/lia-07/advent-of-code-typescript-starter by lia-8629@proton.me",
        },
      })
        .then(async (i) => {
          writeFile(inputPath, await i.text());
          console.info("✅ ...Done.\n");
        })
        .catch((error) => console.error(error));
    } else if (sessionCookie && existsSync(inputPath)) {
      console.info("ℹ️  Input file already exists. Skipping input download.\n");
    } else if (!sessionCookie && !existsSync(inputPath)) {
      console.info(
        "ℹ️  Session cookie was not provided. Skipping input download.\n"
      );
      writeFile(inputPath, "");
    } else {
      console.info(
        "ℹ️  Session cookie was not provided, and input file already exists. Skipping download.\n"
      );
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.info("🎅 Finished successfully.\n");
  console.info(`✨ cd ${dayPath} to continue.\n`);
}
