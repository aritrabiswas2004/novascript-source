from lark import Lark

# Load the grammar from the .lark file
with open("grammar.lark", "r") as file:
    grammar = file.read()

# Create a Lark parser
parser = Lark(grammar, start="program")

# Test code
test_code = """
mut varA = 1;
varA = 1;

print(varA); // 1

const varB = "this is a string";

if (varA > varB){
    print("varA is grates");
} else if (varB > varA){
    print("wohoo");
} else {
    print("they are both equal");
}

mut j = 0;

while (j < 10){
    print(j * 2);
    j = j + 1;
}

for (mut i = 0; i < 10; i = i + 1){
    print(i);
}

mut k = 0;
until (k == 10){
    k = k + 1;
    print(100 * k);
}

const hello = ["this", "is", "an", "array", [varA, varB], 3.14];

func squareNum(num){
    print("Number entered: ", num);
    return num * num;
}

print(squareNum(10)); // prints 100

class Coordinate {
    mut xCoord;
    mut yCoord;

    func constructor(xVal, yVal){
        this.xCoord = xVal;
        this.yCoord = yVal;
    }

    func getXCoord(){
        return this.xCoord;
    }
}

mut point = new Coordinate(12, 34);
print(point.getXCoord());
"""

# Parse the test code
try:
    tree = parser.parse(test_code)
    print("Parsing succeeded! Here's the parse tree:")
    print(tree.pretty())
except Exception as e:
    print("Parsing failed with the following error:")
    print(e)