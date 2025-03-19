class Person {
    private pname = ""
    private age = 0

    constructor(name: string, age: number) {
        this.pname = name;
        this.age = age
    }

    public get name(){
        return this.pname;
    }
}

const student1 = new Person("Aritra", 20);

console.log(student1.name);
