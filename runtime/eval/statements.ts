import {
    ForStatement,
    FunctionDeclaration,
    IfStatement,
    Program,
    Stmt, TryCatchStatement, UntilStatement,
    VarDeclaration,
    WhileStatement
} from "../../frontend/ast";
import Environment from "../environment";
import {BooleanVal, FunctionValue, MK_NULL, RuntimeVal} from "../values";
import {evaluate} from "../interpreter";
import {eval_assignment} from "./expressions";

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

export function eval_until_statement(declaration: UntilStatement, env: Environment): RuntimeVal {
    env = new Environment(env);

    let test = evaluate(declaration.test, env);

    while ((test as BooleanVal).value === false){
        eval_if_body(declaration.body, new Environment(env), false);
        test = evaluate(declaration.test, env);
    }

    return MK_NULL();
}

export function eval_for_statement(declaration: ForStatement, env: Environment): RuntimeVal {
    env = new Environment(env);

    eval_var_declaration(declaration.init, env);

    const body = declaration.body;
    const update = declaration.update;

    let test = evaluate(declaration.test, env);

    if ((test as BooleanVal).value !== true) return MK_NULL(); // The loop didn't start

    do {
        eval_if_body(body, new Environment(env), false);
        eval_assignment(update, env);

        test = evaluate(declaration.test, env);
    } while ((test as BooleanVal).value);

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

export function eval_try_catch(declaration: TryCatchStatement, env: Environment): RuntimeVal {
    const try_env = new Environment(env);
    const catch_env = new Environment(env);

    try {
        const result = eval_if_body(declaration.body, try_env, false);
        return result ?? MK_NULL();
    } catch (e) {
        try {
            const result = eval_if_body(declaration.alternate, catch_env, false);
            return result ?? MK_NULL();
        } catch (innerError) {
            throw new Error("Unhandled error in catch block: " + innerError);
        }
    }
}
