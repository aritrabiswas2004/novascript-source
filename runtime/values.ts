/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Data Types
 *
 * Converts TypeScript data types to NovaScript
 * runtime values.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import Environment from "./environment";
import {FunctionDeclaration, Stmt, VarDeclaration} from "../frontend/ast";

export type ValueType = "null"
    | "number"
    | "boolean"
    | "object"
    | "native-fn"
    | "function"
    | "string"
    | "array"
    | "class"
    | "class-obj";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null",
    value: null
}

export function MK_NULL(){
    return {type: "null", value: null} as NullVal;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean",
    value: boolean
}

export function MK_BOOL(b = true) {
    return {type: "boolean", value: b} as BooleanVal;
}

export interface NumberVal extends RuntimeVal {
    type: "number",
    value: number
}

export function MK_NUMBER(n:number = 0){
    return {value: n, type: "number"} as NumberVal;
}

export interface StringVal extends RuntimeVal {
    type: "string";
    value: string;
}

export function MK_STRING(str: string = ""): StringVal {
    return { value: str, type: "string" } as StringVal;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}

export function MK_OBJECT(obj: Map<string, RuntimeVal>): ObjectVal {
    return { type: "object", properties: obj } as ObjectVal;
}

export type FunctionCall = ( args: RuntimeVal[], env: Environment ) => RuntimeVal;

export interface NativeFnValue extends RuntimeVal {
    type: "native-fn";
    call: FunctionCall;
}

export function MK_NATIVE_FN(call: FunctionCall): NativeFnValue {
    return {type: "native-fn", call} as NativeFnValue;
}

export interface FunctionValue extends RuntimeVal {
    type: "function";
    name: string;
    parameters: string[];
    declarationEnv: Environment;
    body: Stmt[];
}

export interface ArrayVal extends RuntimeVal {
    type: "array";
    values: RuntimeVal[];
}

export function MK_ARRAY(arr: RuntimeVal[]): ArrayVal {
    return { type: "array", values: arr } as ArrayVal;
}

export interface ClassValue extends RuntimeVal {
    type: "class";
    name: string;
    declarationEnv: Environment;
    methods: FunctionDeclaration[];
    properties: VarDeclaration[];
}

export interface ClassObjectValue extends RuntimeVal {
    type: "class-obj";
    className: string;
    properties: Map<string, RuntimeVal>;
}

export function MK_CLASS_OBJ(className: string, classObject: Map<string, RuntimeVal>): ClassObjectValue {
    return {type: "class-obj", className: className, properties: classObject} as ClassObjectValue;
}
