import {MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, NumberVal, RuntimeVal} from "./values";

// creating lang bultins
export function createGlobalEnv() {
    const env = new Environment();
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    env.declareVar("print", MK_NATIVE_FN((args, scope) => {
        console.log(...args);
        return MK_NULL();
    }), true);

    function timeFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
        return MK_NUMBER(Date.now());
    }

    function powFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
        if (_args.length != 2){
            console.error("pow() function only takes two args: (base, power)");
            process.exit(1);
        }

        const base: number = (_args[0] as NumberVal).value;
        const power: number = (_args[1] as NumberVal).value;

        const result = Math.pow(base, power);

        return MK_NUMBER(result);
    }

    function floorFunc(_args: RuntimeVal[], _env: Environment): RuntimeVal {
        if (_args.length != 1){
            console.error("floor() function takes two args: (base, power)");
            process.exit(1);
        }

        const num: number = (_args[0] as NumberVal).value;
        const result = Math.floor(num);

        return MK_NUMBER(result);
    }

    function randInt(_args: RuntimeVal[], _env: Environment): RuntimeVal {
        if (_args.length != 2){
            console.error("randInt() function takes two args: (min, max)");
            process.exit(1);
        }

        const minCeiled = Math.ceil((_args[0] as NumberVal).value);
        const maxFloored = Math.floor((_args[1] as NumberVal).value);

        return MK_NUMBER(Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled));
    }

    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
    env.declareVar("pow", MK_NATIVE_FN(powFunction), true);
    env.declareVar("floor", MK_NATIVE_FN(floorFunc), true);
    env.declareVar("randInt", MK_NATIVE_FN(randInt), true);

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