interface Sample {
    kind: "type";
    value: number;
}

function testFn(args: Sample[]){
    console.log(...args.map(arg => arg.value));
}

testFn([{kind: "type", value: 2} as Sample, {kind: "type", value: 3} as Sample])
