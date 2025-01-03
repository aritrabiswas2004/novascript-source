const seq: string[] = "= == = == = = ==".split("");

let singleEquals: string[] = new Array<string>();
const doubleEquals: string[] = new Array<string>();

console.log(seq);

while (seq.length > 0){
    if (seq[0] == '='){
        if (seq[1] == '='){
            const strToPush = seq.shift() + seq.shift();
            doubleEquals.push(strToPush);
        } else {
            singleEquals.push(seq.shift());
        }
    } else {
        seq.shift();
    }
}

console.log(singleEquals);
console.log(doubleEquals);

