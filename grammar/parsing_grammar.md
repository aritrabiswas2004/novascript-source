# NovaScript Linguistics

## Grammar

NovaScript like most other programming languages does not use [context-free grammars](https://en.wikipedia.org/wiki/Context-free_grammar)
and so a CFG parser is not the best choice to parse NovaScript code. Despite this,
PEG parsers used in languages like Python will work with NovaScript.

In this project, the parser and evaluator were coded before the grammar was determined
hence the `novascrip.ebnf` file contains notation of the grammar making it seem like
the language uses a context-free grammar but in reality direct implementation of the
grammar will not work.

## Tests with Lark

Lark is a python library specifically used to test pieces of a language using its
grammar. NovaScript will soon include Lark tests to verify correct definitions of grammar
in the language.

### Standard Implementation of Lark

A statement like

```javascript
print("hello world");
```

The simple statement above can be described in Lark with the help of regular expressions
like the grammar below.

```lark
start : program

program : statement* ";"

statement : if_statement
            | print_statement
            | for_statement
            | STRING
            
print_statement: "print" "(" STRING ") ";"

STRING: /"[.*?]"/
```

## Contributing to Tests

Please do send us test cases to check the validity of the grammar!
