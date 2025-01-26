/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Expressions Evaluation (Interpreter)
 *
 * Evaluates expressions after parsing.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import {
    ArrayVal,
    BooleanVal, ClassObjectValue, ClassValue,
    FunctionValue,
    MK_BOOL,
    MK_NULL,
    NativeFnValue,
    NumberVal,
    ObjectVal,
    RuntimeVal
} from "../values";
import {
    ArrayIndexExpr,
    ArrayLiteral,
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Identifier,
    MemberExpr, NewExpr,
    ObjectLiteral, VarDeclaration
} from "../../frontend/ast";
import Environment from "../environment";
import {evaluate} from "../interpreter";
import {eval_function_declaration, eval_var_declaration} from "./statements";

function eval_comparison_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): BooleanVal {
    let resultBool: boolean;

    if (operator == ">"){
        resultBool = lhs.value > rhs.value;
    } else if (operator == "<"){
        resultBool = lhs.value < rhs.value;
    } else if (operator == "=="){
        resultBool = lhs.value == rhs.value;
    } else if (operator == ">="){
        resultBool = lhs.value >= rhs.value;
    } else if (operator == "<="){
        resultBool = lhs.value <= rhs.value;
    } else {
        throw "Unrecognised comparison operator";
    }

    return MK_BOOL(resultBool);
}

function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal{
    let result: number;

    if (operator == "+"){
        result = lhs.value + rhs.value;
    } else if (operator == "-"){
        result = lhs.value - rhs.value;
    } else if (operator == "*"){
        result = lhs.value * rhs.value;
    } else if (operator == "/"){
        result = lhs.value / rhs.value;
    } else {
        result = lhs.value % rhs.value;
    }

    return {value: result, type: "number"};
}

export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type == "number" && rhs.type == "number" && ["+", "-", "*", "/", "%"].includes(binop.operator)){
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    } else if ([">", "<", "==", ">=", "<="].includes(binop.operator)){
        return eval_comparison_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    return MK_NULL();
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeVal {
    if (node.assigne.kind !== "Identifier"){
        throw `Cannot assign with LHS invalid assignment expr ${JSON.stringify(node.assigne)}`;
    }

    const varname = (node.assigne as Identifier).symbol;
    return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr (obj: ObjectLiteral, env: Environment): RuntimeVal {
    const object = {type: "object", properties: new Map()} as ObjectVal;

    for (const {key, value} of obj.properties){
        const runtimeVal = (value == undefined) ? env.lookupVar(key) : evaluate(value, env);

        object.properties.set(key, runtimeVal);
    }

    return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
    const args = expr.args.map((arg) => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (fn.type == "native-fn"){
        const result = (fn as NativeFnValue).call(args, env);
        return result;
    }

    if (fn.type == "function"){
        const func = fn as FunctionValue;

        const scope = new Environment(func.declarationEnv);

        for (let i = 0; i < func.parameters.length; i++){
            const varname = func.parameters[i];
            scope.declareVar(varname, args[i], false);
        }

        let result: RuntimeVal = MK_NULL();

        for (const stmt of func.body){
            result = evaluate(stmt, scope);
        }

        return result;
    }

    throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}

export function eval_array_expr(arr: ArrayLiteral, env: Environment): RuntimeVal {
    const array = { type: "array", values: [] } as ArrayVal;

    for(const value of arr.values) {
        const runtimeVal = evaluate(value, env);

        array.values.push(runtimeVal);
    }

    return array;
}

export function eval_member_expr(expr: MemberExpr, env: Environment): RuntimeVal {

    const object = evaluate(expr.object, env);

    if (object.type === "class-obj"){
        const classObj = object as ClassObjectValue;

        const values = classObj.properties.get(expr.property);

        if (values === undefined){
            throw new Error(`Property '${expr.property}' does not exist on the class ${classObj.className}.`)
        }

        return values;
    }

    if (object.type !== "object") {
        throw new Error(`Cannot access property '${expr.property}' on non-object type.`);
    }

    const obj = object as ObjectVal;

    const propertyValue = obj.properties.get(expr.property);

    if (propertyValue === undefined) {
        throw new Error(`Property '${expr.property}' does not exist on the object.`);
    }

    return propertyValue;
}

export function eval_array_index_expr(expr: ArrayIndexExpr, env: Environment): RuntimeVal {
    const object = evaluate(expr.object, env);

    if (object.type != "array"){
        throw new Error("Indexing [] passed to non-array object");
    }

    const array = object as ArrayVal;
    const index = evaluate(expr.index, env);

    if (index.type !== "number") {
        throw new Error(`Index is of type'${index.type}', expected type 'number'`);
    }

    const indexNum = (index as NumberVal).value;

    if (indexNum < 0 || indexNum >= array.values.length) {
        throw new Error("Index out of bounds");
    }

    return array.values[indexNum];
}

export function eval_new_expr(expr: NewExpr, env: Environment): RuntimeVal {
    const classVal = env.lookupVar(expr.className) as ClassValue;
    const newerEnv = new Environment(classVal.declarationEnv);

    if (!classVal || classVal.type !== "class"){
        throw new Error(`'${expr.className}' is not a class.`);
    }

    const obj: ClassObjectValue = {
        type:"class-obj",
        className: classVal.name,
        properties: new Map(),
    };

    for (const prop of classVal.properties){
        const initialValue = eval_var_declaration(prop, newerEnv);
        obj.properties.set(prop.identifier, initialValue);
    }

    for (const meth of classVal.methods){
        const initMeth = eval_function_declaration(meth, newerEnv);
        obj.properties.set(meth.name, initMeth);
    }

    return obj;
}
