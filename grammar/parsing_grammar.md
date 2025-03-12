# NovaScript Linguistics

## Grammar

NovaScript like most other programming languages does not use [context-free grammars](https://en.wikipedia.org/wiki/Context-free_grammar)
and so a CFG parser is not the best choice to parse NovaScript code. Despite this,
PEG parsers used in languages like Python will work with NovaScript.

In this project, the parser and evaluator were coded before the grammar was determined
hence the `novascrip.ebnf` file contains notation of the grammar making it seem like
the language uses a context-free grammar but in reality direct implementation of the
grammar will not work.

## Linguistics Theory

The knowledge of linguistics theory required to create this grammar was acquired from the 
Radboud University
[course notes for Formal Reasoning](https://www.cs.ru.nl/~freek/courses/fr-2020/public/fr.pdf)
(Chapter 3: Languages). The authors and credits are on the first page of the document.


Revised from the original Dutch version of [Formeel Denken](https://www.cs.ru.nl/~freek/courses/fd-2011/public/fd.pdf) and translated by Kelley van
Evert in the fall of 2016.


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

For checking the grammar, utilise the `test_expression`
function from `test_grammar.py`. The other python files
are for specific type of grammar tests.

For example, the file `var_testing.py` tests var declarations
syntax grammar only.

### Definition of Test Function (`test_expression()`)

#### Args

- `statement` - The statement/expression to be tested in string form.
- `eval` - Boolean (default True) on what result the statement should produce (PASS/FAIL)
- `showtree` - Show the AST (default False)

#### Example Test Cases

```python
# Expect a False return due to no semi colon
test_expression("mut foo = 34", False) 

# Expect a True return due to correct syntax
test_expression("mut foo = 34;", True)
```

#### Outputs

```text
case => 'mut foo = 34' :: eval => False :: PASSED
case => 'mut foo = 34;' :: eval => True :: PASSED
```