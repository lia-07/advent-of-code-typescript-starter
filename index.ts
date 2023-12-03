import { mkdir, writeFile } from "fs/promises";

import { existsSync } from "fs";
import { join } from "path";

const sessionCookie = process.env.SESSION_COOKIE;

scaffold(Number(Bun?.argv[2]), Number(Bun?.argv[3]));

async function scaffold(year?: number, day?: number): Promise<void> {
  // if unspecified, fill in year and day
  if (!day && !year) {
    // make sure it's december est if day and year aren't provided
    if (
      new Date().toLocaleString("en-US", {
        timeZone: "EST",
        month: "numeric",
      }) !== "12"
    ) {
      console.error("❌ Current month (EST)/month provided is not December.");
      return;
    }

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

  // if the year is invalid
  if (year! > new Date().getFullYear() || year! < 2015) {
    console.error("❌ Current year/year provided is invalid.");
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
    console.error("❌ Current day/day provided is invalid.");
    return;
  }

  const dayPath = join(String(year), `day-${String(day).padStart(2, "0")}`);

  const part1Path = join(dayPath, "part-1.ts");
  const part2Path = join(dayPath, "part-2.ts");

  const inputPath = join(dayPath, "in.txt");

  const test1Path = join(dayPath, "part-1.test.ts");
  const test2Path = join(dayPath, "part-2.test.ts");

  console.info(`\n🎄 Scaffolding for ${year} Advent of Code day ${day}...\n`);
  // create the files and directories
  try {
    mkdir(dayPath, {
      recursive: true,
    });

    // make the file for part 1 and it's test if they don't exist already
    if (!existsSync(part1Path)) {
      writeFile(
        part1Path,
        `import { readFile } from "fs/promises";

export function solve(input: string): any {
  // Your code goes here...
}

// so bun test doesn't execute it (i know, right?)
if (Bun.argv[2] === "solve") {
  readFile("in.txt", "utf-8")
    .then((inputFile) => {
      console.log(solve(inputFile));
    })
    .catch((error) => {
      console.error("❌ " + error);
    });
}
`
      );
    }
    if (!existsSync(test1Path)) {
      writeFile(
        test1Path,
        `import { expect, test } from "bun:test";

import { solve } from "./part-1";

// Fill in the test data below
const testInput = \`\`;

const testAnswer = ;

test("Part 1", () => {
  expect(solve(testInput)).toBe(testAnswer);
});
`
      );
    }

    // i think mac os blocked it for opening files too quickly idk
    await new Promise((r) => setTimeout(r, 200));

    // make the file for part 2 and it's test if they don't exist already
    if (!existsSync(part2Path)) {
      writeFile(
        part2Path,
        `import { readFile } from "fs/promises";

export function solve(input: string): any {
  // Your code goes here...
}

// so bun test doesn't execute it (i know, right?)
if (Bun.argv[2] === "solve") {
  readFile("in.txt", "utf-8")
    .then((inputFile) => {
      console.log(solve(inputFile));
    })
    .catch((error) => {
      console.error("❌ Error reading input: " + error);
    });
}
`
      );
    }
    if (!existsSync(test2Path)) {
      writeFile(
        test2Path,
        `import { expect, test } from "bun:test";

import { solve } from "./part-2";

// Fill in the test data below
const testInput = \`\`;

const testAnswer = ;

test("Part 2", () => {
  expect(solve(testInput)).toBe(testAnswer);
});
`
      );
    }
  } catch (error: any) {
    console.error(`❌ ${error.message}`);
    return;
  }

  // if the user provided their session cookie, download the input file
  // (also check it hasn't already been downloaded)
  if (sessionCookie && !existsSync(inputPath)) {
    console.info("⬇️  Downloading input file...");

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
      .catch((error) => {
        console.error("❌ " + error + "\n");
        console.info("💡 Download failed. Skipping input download.\n");
      });
  } else if (sessionCookie && existsSync(inputPath)) {
    console.info("💡 Input file already exists. Skipping input download.\n");
  } else if (!sessionCookie && !existsSync(inputPath)) {
    console.info(
      "💡 Session cookie was not provided. Skipping input download.\n"
    );
    writeFile(inputPath, "");
  } else {
    console.info(
      "💡 Session cookie was not provided, and input file already exists. Skipping download.\n"
    );
  }

  console.info("🎅 Finished successfully.\n");
  console.info(`✨ cd ${dayPath} to continue.\n`);
}
