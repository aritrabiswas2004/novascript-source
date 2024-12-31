# NovaScript Source

Inspired by the [XKCD comic 927](https://xkcd.com/927/), NovaScript is a dynamically-typed and interpreted language with support for objects creation.
The language lexer and parser is written in TypeScript. The syntax for NovaScript is similar to JavaScript and retains most of the keywords.

This project was done with help from the [Tyler Laceby YouTube tutorial](https://www.youtube.com/watch?v=8VB5TY1sIRo&list=PL_2VhOvlMk4UHGqYCLWc6GO8FaPl8fQTh) on creating a programming language from scratch.

This README file contains documentation for the language and of the extent of its support at a given moment.

### Running

NovaScript can be explored by two different modes just like other interpreted languages like JavaScript using Node.js or Python.
As of now running the language requires Node.js to be installed on your system. This is subject to change when the project is compiled to
an executable.

- **Interactive Mode**
  - This can be activated by uncommenting the `repl()` function in the `main.ts` file.
    It executes a single line of NovaScript at a time.
- **Script Mode**
  - This is when an entire file of code is read an executed by the interpreter. A `file.nv` is given as a test script. All NovaScript files must have a `.nv` extension.
    This is done by passing a NovaScript file to the `run()` function in `main.ts`.

---

## Syntax and Features

> NovaScript already supports some basic features but more support for certain statements and expression are soon
to be added. The features to be included in the future are given in a TODO list below.

> The language prints the entire object to console. This will be changed when the object token parser is implemented.
### Variables

Variables can be declared with the `mut` keyword. This makes the variable mutable and can be reassigned.

```javascript
mut foo = 23;
foo = 91
print(foo); // 91
```

By using the `const` keyword, the variable becomes immutable

```javascript
const foo = 23;
foo = 34; // Throws error
```

### Binary Expression


