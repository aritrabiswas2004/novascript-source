import {RuntimeVal, MK_STRING, MK_NUMBER} from "./values";
import {
    ArrayLiteral,
    AssignmentExpr,
    BinaryExpr, CallExpr, ForStatement, FunctionDeclaration,
    Identifier, IfStatement,
    NumericLiteral, ObjectLiteral,
    Program,
    Stmt, StringLiteral, TryCatchStatement, UntilStatement,
    VarDeclaration, WhileStatement
} from "../frontend/ast";
import Environment from "./environment";
import {
    eval_array_expr,
    eval_assignment,
    eval_binary_expr,
    eval_call_expr,
    eval_identifier,
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
    eval_try_catch
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

        default:
            console.error("This AST node has not yet been set for interpretation", astNode);
            process.exit(0);
    }
}
