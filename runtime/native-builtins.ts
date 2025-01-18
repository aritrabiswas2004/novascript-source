/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Native Functions
 *
 * Defines a set of builtin functions.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import {
    ArrayVal,
    BooleanVal,
    MK_ARRAY,
    MK_NULL,
    MK_NUMBER,
    MK_STRING, NullVal,
    NumberVal,
    RuntimeVal,
    StringVal
} from "./values";
import Environment from "./environment";


function runtimeToJs(runtime: RuntimeVal){
    switch (runtime.type){
        case "string":
            return (runtime as StringVal).value;
        case "boolean":
            return (runtime as BooleanVal).value;
        case "null":
            return (runtime as NullVal).value;
        case "number":
            return (runtime as NumberVal).value;
        default:
            throw new Error(`Expected types [string | boolean | number] but got ${runtime}`)
    }
}

export function printFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    // console.log(..._args); // For debug purposes
    function formatValue(value: RuntimeVal): string {
        switch (value.type) {
            case "number":
                return (value as NumberVal).value.toString();
            case "string":
                return `"${(value as StringVal).value}"`;
            case "boolean":
                return (value as BooleanVal).value.toString();
            case "null":
                return "null";
            case "array":
                const arr = (value as ArrayVal).values;
                const formattedItems = arr.map(formatValue); // Recursively format each item
                return `[${formattedItems.join(", ")}]`;
            default:
                throw new Error(`Unrecognized runtime value: ${value.type}`);
        }
    }

    const output = _args.map(formatValue).join(", ");
    console.log(output);

    return MK_STRING(output);
}

export function timeFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    return MK_STRING(Date());
}

export function powFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args.length != 2){
        console.error("pow() function only takes two args: (base, power)");
        process.exit(1);
    }

    const base: number = (_args[0] as NumberVal).value;
    const power: number = (_args[1] as NumberVal).value;

    const result = Math.pow(base, power);

    return MK_NUMBER(result);
}

export function floorFunc(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args.length != 1){
        console.error("floor() function takes two args: (base, power)");
        process.exit(1);
    }

    const num: number = (_args[0] as NumberVal).value;
    const result = Math.floor(num);

    return MK_NUMBER(result);
}

export function randInt(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args.length != 2){
        console.error("randInt() function takes two args: (min, max)");
        process.exit(1);
    }

    const minCeiled = Math.ceil((_args[0] as NumberVal).value);
    const maxFloored = Math.floor((_args[1] as NumberVal).value);

    return MK_NUMBER(Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled));
}

export function sumFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    let total: number = 0;

    if (_args[0].type == "array"){
        const numArray: RuntimeVal[] = (_args[0] as ArrayVal).values;

        for (const rVal of numArray){
            const nVal = rVal as NumberVal;
            total += nVal.value;
        }

        return MK_NUMBER(total);
    }

    for (const nval of _args){
        total += (nval as NumberVal).value;
    }

    return MK_NUMBER(total);
}

export function strConcatFunc(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    let finalString = "";

    for (const rtval of _args){
        finalString += (rtval as StringVal).value;
    }

    return MK_STRING(finalString);
}

export function maxFunc(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args[0].type == "array") {
        if (_args.length > 1) {
            console.error("Only 1 array supported in max function");
            process.exit(1);
        }

        const arrayToCompareMax: number[] = [];

        const valArray = _args[0] as ArrayVal;

        for (const num of valArray.values){
            arrayToCompareMax.push((num as NumberVal).value);
        }

        const maxValue = Math.max(...arrayToCompareMax);

        return MK_NUMBER(maxValue);
    } else if (_args[0].type == "number"){
      if (_args.length != 2){
        console.error("Max function has more than 2 args");
        process.exit(1);
      }

      if ((_args[0] as NumberVal).value > (_args[1] as NumberVal).value){
          return _args[0];
      }

      return _args[1];
    }
}

export function minFunc(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args[0].type == "array") {
        if (_args.length > 1) {
            console.error("Only 1 array supported in min function");
            process.exit(1);
        }

        const arrayToCompareMin: number[] = [];

        const valArray = _args[0] as ArrayVal;

        for (const num of valArray.values){
            arrayToCompareMin.push((num as NumberVal).value);
        }

        const minValue = Math.min(...arrayToCompareMin);

        return MK_NUMBER(minValue);
    } else if (_args[0].type == "number"){
      if (_args.length != 2){
        console.error("Min function has more that 2 args");
        process.exit(1);
      }

      if ((_args[0] as NumberVal).value < (_args[1] as NumberVal).value){
          return _args[0];
      }

      return _args[1];
    }
}

export function splitFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args[0].type == "string" && _args[1].type == "string"){
        const mainStr = (_args[0] as StringVal).value;
        const splitChar = (_args[1] as StringVal).value;

        const splitArr = mainStr.split(splitChar);

        const runtimeStringVals = new Array<RuntimeVal>;

        for (const item of splitArr){
            runtimeStringVals.push(MK_STRING(item));
        }

        return MK_ARRAY(runtimeStringVals);
    } else {
        throw new Error("Both args of be strings");
    }
}

export function typeFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args.length > 1){
        throw new Error("Cannot identify type for more than 2 Runtime Values. type() takes only 1 arg");
    }

    return MK_STRING(_args[0].type);
}

export function countCharsFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (_args.length > 1){
        throw new Error("countChars() has more than 1 argument");
    } else if (_args[0].type != "string"){
        throw new Error(`countChars() function expected type 'string' but got '${_args[0].type}'`);
    }

    return MK_NUMBER((_args[0] as StringVal).value.length);
}

export function stdDevFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    return MK_NULL();
}

