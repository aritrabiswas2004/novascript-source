/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Main
 *
 * Runs scripts or repls.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import Parser from "./frontend/parser";
import promptSync from 'prompt-sync';
import {evaluate} from "./runtime/interpreter";
import {createGlobalEnv} from "./runtime/environment";
import {readFileSync} from "fs";

// repl();
main();
// run("./file.nv"); // development

function run(filename: string){
    const parser = new Parser();
    const env = createGlobalEnv();

    if (!filename.endsWith(".nv")){
        console.error("File name must end with a '.nv' extension.");
        process.exit(1);
    }

    // console.log("===================== NOVA v0.2.0 ========================"); // comment in dev

    const input = readFileSync(filename,  "utf-8");
    const program = parser.produceAST(input);
    const results = evaluate(program, env);

    // console.log(results);
}

function repl() {
    const parser = new Parser();
    const env = createGlobalEnv();

    const prompt = promptSync();

    console.log("NovaScript Repl v0.2.0");

    while (true) {

        const input = prompt(">>> ");

        if (!input || input.includes("exit")){
            process.exit(1);
        }

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result)

    }
}

function main(){
    const argv = process.argv.slice(2);

    if (argv.length != 0){
        run(process.argv.slice(2)[0] as string);
    } else {

        const isCI = process.env.CI === "true";

        if (!isCI){
            repl();
        } else {
            console.log("repl() mode override in CI");
        }
    }
}
