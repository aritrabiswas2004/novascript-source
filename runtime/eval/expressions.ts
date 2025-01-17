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
    BooleanVal,
    FunctionValue,
    MK_BOOL,
    MK_NULL,
    NativeFnValue,
    NumberVal,
    ObjectVal,
    RuntimeVal, StringVal
} from "../values";
import {
    ArrayLiteral,
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Identifier,
    MemberExpr,
    ObjectLiteral, StringLiteral
} from "../../frontend/ast";
import Environment from "../environment";
import {evaluate} from "../interpreter";

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
    const object = evaluate(expr.object, env) as ObjectVal;

    if (object.type !== "object") {
        throw new Error(`Cannot access property '${expr.property}' on non-object type.`);
    }

    const propertyValue = object.properties.get(expr.property);

    if (propertyValue === undefined) {
        throw new Error(`Property '${expr.property}' does not exist on the object.`);
    }

    return propertyValue;
}