import * as path from "node:path";
import * as os from "node:os";

console.log(process.argv);
console.log(path.join(path.join(process.argv[1], ".."), `.\\${process.argv[2]}`));

console.log(os.type())
