/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Interpreter
 *
 * Collective interpretation of statements and
 * expressions.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import {RuntimeVal, MK_STRING, MK_NUMBER} from "./values";
import {
    ArrayIndexExpr,
    ArrayLiteral,
    AssignmentExpr,
    BinaryExpr, CallExpr, ClassDeclaration, ForStatement, FunctionDeclaration,
    Identifier, IfStatement, ImportStatement, MemberExpr, NewExpr,
    NumericLiteral, ObjectLiteral,
    Program, ReturnStatement,
    Stmt, StringLiteral, TryCatchStatement, UntilStatement,
    VarDeclaration, WhileStatement
} from "../frontend/ast";
import Environment from "./environment";
import {
    eval_array_expr, eval_array_index_expr,
    eval_assignment,
    eval_binary_expr,
    eval_call_expr,
    eval_identifier, eval_member_expr, eval_new_expr,
    eval_object_expr
} from "./eval/expressions";
import {
    eval_program,
    eval_var_declaration,
    eval_function_declaration,
    eval_if_statement,
    eval_while_statement,
    eval_for_statement,
    eval_until_statement,
    eval_try_catch, eval_import_statement, eval_class_declaration, eval_return_statement
} from "./eval/statements";


export function evaluate(astNode: Stmt, env: Environment): RuntimeVal{
    switch (astNode.kind){
        case "NumericLiteral":
            return MK_NUMBER((astNode as NumericLiteral).value);

        case "StringLiteral":
            return MK_STRING((astNode as StringLiteral).value);

        case "Identifier":
            return eval_identifier(astNode as Identifier, env);

        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral, env);

        case "CallExpr":
            // console.log(astNode);
            return eval_call_expr(astNode as CallExpr, env);

        case "AssignmentExpr":
            return eval_assignment(astNode as AssignmentExpr, env);

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);

        case "Program":
            return eval_program(astNode as Program, env);

        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);

        case "FunctionDeclaration":
            return eval_function_declaration(astNode as FunctionDeclaration, env);

        case "IfStatement":
            return eval_if_statement(astNode as IfStatement, env);

        case "WhileStatement":
            return eval_while_statement(astNode as WhileStatement, env);

        case "ForStatement":
            return eval_for_statement(astNode as ForStatement, env);

        case "UntilStatement":
            return eval_until_statement(astNode as UntilStatement, env);

        case "ArrayLiteral":
            return eval_array_expr(astNode as ArrayLiteral, env);

        case "TryCatchStatement":
            return eval_try_catch(astNode as TryCatchStatement, env);

        case "MemberExpr":
            return eval_member_expr(astNode as MemberExpr, env);

        case "ArrayIndexExpr":
            return eval_array_index_expr(astNode as ArrayIndexExpr, env);

        case "ImportStatement":
            return eval_import_statement(astNode as ImportStatement, env);

        case "ClassDeclaration":
            return eval_class_declaration(astNode as ClassDeclaration, env);

        case "NewExpr":
            return eval_new_expr(astNode as NewExpr, env);

        case "ReturnStatement":
            return eval_return_statement(astNode as ReturnStatement, env);

        default:
            console.error("This AST node has not yet been set for interpretation", astNode);
            process.exit(0);
    }
}
