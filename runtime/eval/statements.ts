import {FunctionDeclaration, IfStatement, Program, Stmt, VarDeclaration, WhileStatement} from "../../frontend/ast";
import Environment from "../environment";
import {BooleanVal, FunctionValue, MK_NULL, RuntimeVal} from "../values";
import {evaluate} from "../interpreter";

export function eval_program(program: Program, env: Environment): RuntimeVal{
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of program.body){
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

export function eval_var_declaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
    const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
    return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_declaration(declaration: FunctionDeclaration, env: Environment): RuntimeVal {
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body
    } as FunctionValue;

    return env.declareVar(declaration.name, fn, true);
}

export function eval_if_statement(declaration: IfStatement, env: Environment): RuntimeVal {
    const test = evaluate(declaration.test, env);

    if ((test as BooleanVal).value === true){
        return eval_if_body(declaration.body, env);
    } else if (declaration.alternate) {
        return eval_if_body(declaration.alternate, env);
    } else {
        return MK_NULL();
    }
}

export function eval_while_statement(declaration: WhileStatement, env: Environment): RuntimeVal {
    env = new Environment(env);

    let test = evaluate(declaration.test, env);

    while ((test as BooleanVal).value === true){
        eval_if_body(declaration.body, new Environment(env), false);
        test = evaluate(declaration.test, env);
    }

    return MK_NULL();
}

function eval_if_body(body: Stmt[], env: Environment, newEnv: boolean = true): RuntimeVal {
    let scope: Environment;

    if (newEnv) {
        scope = new Environment(env);
    } else {
        scope = env;
    }

    let result: RuntimeVal = MK_NULL();

    for (const statement of body){
        result = evaluate(statement, scope);
    }

    return result;
}

