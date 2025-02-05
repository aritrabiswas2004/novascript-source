/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Environment
 *
 * Describes scope and assigns macros.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import {MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, MK_OBJECT, MK_STRING, RuntimeVal} from "./values";
import {
    assertFunction,
    floorFunc, lengthFunction, maxFunc, minFunc, openFileFunction,
    powFunction,
    printFunction,
    randInt, runListener, sortFunction, splitFunction,
    strConcatFunc,
    sumFunction,
    timeFunction, typeFunction
} from "./native-builtins";
// @ts-ignore
import path from "node:path";
import * as os from "node:os";

// creating lang bultins
export function createGlobalEnv() {
    let sourcePath: string;
    if (os.type() == "Windows_NT"){
        sourcePath = path.join(path.join(process.argv[1], ".."), `.\\${process.argv[2]}`);
    } else {
        sourcePath = path.join(path.join(process.argv[1], ".."), `./${process.argv[2]}`)
    }

    const env = new Environment(undefined, sourcePath);
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);
    env.declareVar("print", MK_NATIVE_FN(printFunction), true);
    env.declareVar("datetime", MK_NATIVE_FN(timeFunction), true);
    env.declareVar("type", MK_NATIVE_FN(typeFunction), true);
    env.declareVar("assert", MK_NATIVE_FN(assertFunction), true);

    // math
    env.declareVar("pow", MK_NATIVE_FN(powFunction), true);
    env.declareVar("floor", MK_NATIVE_FN(floorFunc), true);
    env.declareVar("sum", MK_NATIVE_FN(sumFunction), true);
    env.declareVar("max", MK_NATIVE_FN(maxFunc), true);
    env.declareVar("min", MK_NATIVE_FN(minFunc), true);

    // string
    env.declareVar("splitStr", MK_NATIVE_FN(splitFunction), true);
    env.declareVar("concat", MK_NATIVE_FN(strConcatFunc), true);
    env.declareVar("length", MK_NATIVE_FN(lengthFunction), true);

    // array
    env.declareVar("sortArray", MK_NATIVE_FN(sortFunction), true);

    // random
    env.declareVar("random", MK_OBJECT(
        new Map()
            .set("randInt", MK_NATIVE_FN(randInt))
    ), true);

    // consts
    env.declareVar("constants", MK_OBJECT(
        new Map()
            .set("pi", MK_NUMBER(Math.PI))
            .set("e", MK_NUMBER(Math.E))
            .set("nova", MK_STRING("https://xkcd.com/927/"))
    ), true);

    // file
    env.declareVar("file", MK_OBJECT(
        new Map()
            .set("read", MK_NATIVE_FN(openFileFunction))
    ), true);

    // hosting
    env.declareVar("startServer", MK_NATIVE_FN(runListener), true);

    // convert


    return env;
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;
    public currentFile?: string;

    constructor(parentENV?:Environment, currentFile?: string) {
        const global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
        this.currentFile = currentFile;
    }

    public declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
        if (this.variables.has(varname)){
            throw `Cannot declare var name ${varname} as it is already defined.`;
        }

        this.variables.set(varname, value);

        if (constant){
            this.constants.add(varname);
        }
        return value;
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
        if (env.constants.has(varname)){
            throw new Error(`Cannot write to var '${varname}' since its a constant.`);
        }
        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    public resolve(varname: string): Environment {
        if (this.variables.has(varname)){
            return this;
        }

        /*if (this.parent == undefined){
            throw `Cannot resolve '${varname}' as this does not exist.`
        }*/

        // Alternative
        if (this.parent == undefined){
            console.error(`Error: The var name '${varname}' cannot be resolved.`)
            process.exit(1)
        }

        return this.parent.resolve(varname);
    }
}