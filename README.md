# NovaScript Source

Inspired by the [XKCD comic 927](https://xkcd.com/927/), NovaScript is a dynamically-typed and interpreted language with support for objects creation.
The language lexer and parser is written in TypeScript. The syntax for NovaScript is similar to JavaScript and retains most of the keywords.

This project was done with help from the [Tyler Laceby YouTube tutorial](https://www.youtube.com/watch?v=8VB5TY1sIRo&list=PL_2VhOvlMk4UHGqYCLWc6GO8FaPl8fQTh) on creating a programming language from scratch and also
the [Bussin language by Face Dev](https://github.com/face-hh/bussin/tree/main) (yes that's the name of the language).

This README file contains documentation for the language and of the extent of its support at a given moment.

### Running

NovaScript can be explored by two different modes just like other interpreted languages like JavaScript using Node.js or Python.
As of now running the language requires Node.js to be installed on your system. This is subject to change when the project is compiled to
an executable.

- **Interactive Mode**
  - This can be activated by uncommenting the `repl()` function in the `main.ts` file.
    It executes a single line of NovaScript at a time.
- **Script Mode**
  - This is when an entire file of code is read an executed by the interpreter. All NovaScript files must have a `.nv` extension.
    This is done by passing a NovaScript file to the `run()` function in `main.ts`.

> A `file.nv` is included in this repo for convenience. It usually contains sample code for the latest feature added to NovaScript.

---

## Syntax and Features

NovaScript already supports some basic features but more support for certain statements and expression are soon
to be added. The features to be included in the future are given in a TODO list below.

> [!WARNING]
> IN NovaScript version v0.1.0, all outputs to the console print in Debug print. To print in
> Release print check the [builtins docs](./BUILTINS.md) for more information.

### Variables

Variables can be declared with the `mut` keyword. This makes the variable mutable and re-assignable.
Variable names must have only letters a-z or A-Z and cannot have numeric values or special characters.

```javascript
mut foo = 23;
foo = 91
print(foo); // 91
```

`mut` variables can be declared without assignment

```javascript
mut foo;
foo = 12;
print(foo) // 12
```

By using the `const` keyword, the variable becomes immutable. `const` variables cannot be declared without a value.

```javascript
const foo = 23;
foo = 34; // Throws error
```

### Binary Expression

NovaScript supports Numeric Binary Expressions of `+`, `-`, `*`, `/` and `%`;

```javascript
const foo = 12 + 45;
print(foo) // 57
```

As an extension of Binary Expressions, comparison expression are also handled such as
`==`, `>=`, `<=`, `>`, `<`.

```javascript
const foo = 1 + 4;
const bar = 2 + 1;

print(foo == bar) // false
print(foo >= bar) // true
print(foo <= bar) // false
print(foo > bar)  // true
print(foo < bar)  // false
```

### Objects

NovaScript supports complex data objects but no direct casting it into types. It combines simple
literals paired with an identifier name to create these complex objects.

```javascript
const foo = {
  bar: "hello world",
  firstVar: 13,
  complex : {
    insideVar: 14,
    secondVar: 15
  }
};

print(foo.bar) // hello world
print(foo.complex.insideVar) // 14
```

### Boolean Expressions

Boolean Expression are part of global constants and can be assigned to variables.

```javascript
const foo = true;
const bar = false;
print(foo); // true
print(bar); // false
```

### Null Expression

Just like Boolean Expressions, Null Expressions can also be assigned to variables. Using a Binary Expression with a null value returns a null value.

```javascript
const foo = null;
const bar = 2 + foo;

print(foo) // null
print(bar) // null
```

### Native Functions (Builtins)

This documentation for this portion is in the `BUILTINS.md` file which can be found [here](https://github.com/Repositoir/novascript-source/blob/master/BUILTINS.md).

### User-defined Functions

Functions can also be defined by the programmer using the `func` keyword. NovaScript supports taking function arguments and
implementing them. A `return` keyword is unnecessary and simply writing the variable/object to be returned in the last line
of the function is enough.

```javascript
func add(x, y) {
    const value = x + y;
    value // No need for return keyword
}

const res = add(10, 4);

print(res) // 14
```

### Comments

Comments on NovaScript are single lined or multi-lined. Comments are not included in parsing and are thrown out by the lexer itself.
As seen on the code-block above and below, the use of comments can be in any place. Single line comments begin with the `//` symbol and multi-line comments
begin with the `/(` token and end with the `)/` token.

```javascript
/(

this is
a multi-line
comment

)/

// this is a single line comment
// this is another comment

print(10000) // ignore this
```

### If-Else Statements

NovaScript has `if-else` statements functionality similar to those of JavaScript. Since block statements are now simplified,
a block will only be read if the expression passed returns a boolean value of true. If a non-boolean expression is 
entered after the `if` statement then the default value is evaluated as `false`.

```javascript
const foo = 3;
const bar = 2;

if (foo < bar) {
    print(100)
} else if (foo == bar) {
    print(300)
} else {
    print(200)
}

// Prints 200
```

### While Loops

`while` loops are supported in NovaScript. A block statement is repeated until the condition given in the while loop is `false`. The block of code
under a while has its own namespace. 

```javascript
mut foo = 1;

while (foo < 10){
    foo = foo + 1
}

print(foo) // 10
```

### For Loops

`for` loops are counting loops and the iterations of the loop are independent of any other variables outside the
loop scope. For loops are declared in the order of - [var declaration, boolean condition, update statement]. A `for` loop will
iterate with the update as long as the condition remains true.

```javascript
for (mut i = 1; i <= 10; i = i + 1){
    print(i)
}

// Outputs numbers 1 ... 10
```

### Until Loops

Just like the Ruby Programming language, NovaScript has `until` loops. In this loop a block of code loops until the expression after the until statement
becomes `true`. It is basically the opposite of the `while` loop.

```javascript
mut i = 1;

until (i == 10) {
    print(i)
    i = i + 1
}

// Prints 1 ... 9
```

### Strings

There is now strings support in NovaScript. Strings are sequences of alphanumeric ASCII characters. The maximum length of a string is 2147483647 characters
(`2^53 - 1`), the same as JavaScript. Strings are declared with the double quotation mark (`"`). Strings now also support ASCII escape sequences such as `\n` as newline,
`\t` for tab whitespaces and `\r` for end of line.

```javascript
const foo = "foo";
const bar = "bar";
const result = concat(foo, bar);

print(result) // prints "foobar"
```

> [!CAUTION]
> Escape sequences only can be observed in Release print and not Debug print. 
> See `native-builtins.ts` for more.

### Arrays

Arrays are a sequences of primary expressions which can be useful to store organised data whose values are needed to constantly be looked-up and used. Syntactically, NovaScript
arrays are the same as JavaScript arrays. Arrays begin with the opening bracket `[` and end with `]` with primary expression values seperated by commas `,`.

```javascript
const foo = [1, 2, 3, "bar", ["foobar", "true"], true];

print(foo) // [1, 2, 3, "bar", ["foobar", "true"], true]
```
Arrays can also be indexed with indexing starting at 0. Array indexing can also be used
simultaneously to access nested literals.

```javascript
const foo = [1, 2, 3, "bar", ["foobar", "true"], true];

print(foo[0]) // 1
print(foo[4][0]) // "foobar"
```

### Try-Catch Statements

NovaScript now has `try-catch` statements. These are used for error handling just like JavaScript. Any error in the `try` block statement
automatically triggers the block statement in `catch` to occur. `try` and `catch` keywords
compliment each other and cannot be used separately.

```javascript
try {
    print("The code below throws an error")
    const foo = "foo";
    foo = "bar"
    print("this will not get printed")
} catch {
    print("Error occurred, exception thrown")
}

// Output:
// The code below throws an error
// Error occurred, exception thrown
```

## TODOs

The below items are TODOs that can be added to the language to increase its support.

#### Legend

| Symbol | Definition                        |
|--------|-----------------------------------|
| ✅      | Task Completed                    |
| ❌      | Facing Errors (see GitHub issues) |
| 🔥     | Work-in-progress                  |

- ✅ Implement a `BooleanExpr` interface and support for more operators like `>`, `<`, `==`.
- ✅ `if-else` statements.
- ✅ `while` loop.
- ✅ `for` loop.
- ✅ `until` loop
- ✅ Include more native functions for basic math tasks like `sum()` or `pow()`.
- ✅ Add comments
- ✅ Add strings
- ✅ Add escape sequences for strings.
- ✅ Try Catch statements.
- ✅Add array indexing.
- ❌ Add import statements from other NovaScript files.
- 🔥BinaryExpr update for `&&`, `||`, `!`.
- 🔥 Operations on arrays as builtins.
- 🔥 Add statistics and regression function. (Hi Arnav!)
- 