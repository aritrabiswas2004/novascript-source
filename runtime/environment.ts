import {MK_BOOL, MK_NATIVE_FN, MK_NULL, RuntimeVal} from "./values";
import {
    floorFunc, maxFunc, minFunc,
    powFunction,
    printFunction,
    randInt,
    strConcatFunc,
    sumFunction,
    timeFunction
} from "./native-builtins";

// creating lang bultins
export function createGlobalEnv() {
    const env = new Environment();
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);
    env.declareVar("print", MK_NATIVE_FN(printFunction), true);
    env.declareVar("datetime", MK_NATIVE_FN(timeFunction), true);
    env.declareVar("pow", MK_NATIVE_FN(powFunction), true);
    env.declareVar("floor", MK_NATIVE_FN(floorFunc), true);
    env.declareVar("randInt", MK_NATIVE_FN(randInt), true);
    env.declareVar("sum", MK_NATIVE_FN(sumFunction), true);
    env.declareVar("concat", MK_NATIVE_FN(strConcatFunc), true);
    env.declareVar("max", MK_NATIVE_FN(maxFunc), true);
    env.declareVar("min", MK_NATIVE_FN(minFunc), true);

    return env;
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor(parentENV?:Environment) {
        const global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
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
            console.error(`Cannot write to var '${varname}' since its a constant.`);
            process.exit(1);
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