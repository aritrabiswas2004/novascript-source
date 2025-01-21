# NovaScript Grammar

NovaScript uses a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) to define syntax
and the accompanying syntax rules for the language. This is unlike JavaScript which is not 
context-free.

> [!CAUTION]
> The grammar is not correct as of version 0.2.0, please help improve the grammar docs of
> NovaScript.

## Parsing Grammar

By using the Lark python library, you can submit test cases which fail the syntax
checks and rules, in this case we can improve the grammar of NovaScript.

## Context-Free Example

Takes the statement

```javascript
print("foobar")
```
This translates to a context-free syntax for Lark using regular expressions.

```rust
start: statement*

statement: print_statement
print_statement: "print" "(" STRING ")"

STRING:/".*?"/
```
