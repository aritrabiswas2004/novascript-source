import * as fs from "node:fs";

const fileContents = fs.readFileSync("../testing.nv", "utf-8");

console.log(fileContents);
