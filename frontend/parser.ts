/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Parser
 *
 * Parses tokens for syntactical accuracy and converts
 * tokens to AST nodes.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */

import {
    ArrayIndexExpr,
    ArrayLiteral,
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    ClassDeclaration,
    Expr,
    ForStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    ImportStatement,
    MemberExpr,
    NewExpr,
    NumericLiteral,
    ObjectLiteral,
    Program,
    Property,
    Stmt,
    StringLiteral,
    TryCatchStatement,
    UntilStatement,
    VarDeclaration,
    WhileStatement
} from "./ast";
import {Token, tokenize, TokenType} from "./lexer";

export default class Parser {

    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat(){
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err){
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type){
            console.error("Parser Error: ", err, prev, "Expecting: ", type);
            process.exit(1);
        }

        return prev;
    }

    public produceAST (sourceCode: string): Program {

        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.not_eof()){
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt(): Stmt {
        switch (this.at().type){
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration();
            case TokenType.Fn:
                return this.parse_fn_declaration();
            case TokenType.Class:
                return this.parse_class_declaration();
            case TokenType.If:
                return this.parse_if_statement();
            case TokenType.While:
                return this.parse_while_statement();
            case TokenType.For:
                return this.parse_for_statement();
            case TokenType.Until:
                return this.parse_until_statement();
            case TokenType.Try:
                return this.parse_try_catch_statement();
            case TokenType.Import:
                return this.parse_import_statement();
            default:
                return this.parse_expr();
        }
    }

    private parse_import_statement(): Stmt {
        this.eat();

        const names: string[] = [];
        let wildcard = false;

        if (this.at().type == TokenType.OpenBrace){
            this.eat();

            while (this.at().type != TokenType.CloseBrace){
                names.push(this.expect(TokenType.Identifier, "Expected identifier").value);
                if (this.at().type === TokenType.Comma) {
                    this.eat();
                }
            }

            this.expect(TokenType.CloseBrace, "Expected '}' after imports");
        } else if (this.at().type == TokenType.BinaryOperator){
            this.eat();
            wildcard = true;
        } else {
            names.push(this.expect(TokenType.Identifier, "Expected identifier").value);
        }

        this.expect(TokenType.From, "Expected 'from' after import identifiers");
        const source = this.expect(TokenType.String, "Expected filename as a 'string'");

        return {
            kind: "ImportStatement",
            names: wildcard ? ["*"] : names,
            source: source.value,
        } as ImportStatement;
    }

    private parse_try_catch_statement(): Stmt {
        this.eat(); // try

        const body = this.parse_block_statement();

        this.expect(TokenType.Catch, "Expected 'catch' after 'try' stmt");

        const alternate = this.parse_block_statement();

        return {
            kind: "TryCatchStatement",
            body,
            alternate
        } as TryCatchStatement;
    }

    private parse_array_expr(): Expr {
        this.eat();

        const values = new Array<Expr>;

        while (this.not_eof() && this.at().type != TokenType.CloseBracket) {
            values.push(this.parse_expr());

            if (this.at().type != TokenType.CloseBracket) {
                this.expect(TokenType.Comma, "Expected ',' after value.");
            }
        }

        this.expect(TokenType.CloseBracket, "Closing Bracket (\"]\") expected at the end of \"Array\" expression.");

        return {kind: "ArrayLiteral", values: values} as ArrayLiteral;
    }

    private parse_block_statement(): Stmt[] {
        this.expect(TokenType.OpenBrace, "Expected '{' for block statement");

        const body: Stmt[] = [];

        while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace){
            body.push(this.parse_stmt());
        }

        this.expect(TokenType.CloseBrace, "Expected '}' at end of block statement");

        return body;
    }

    private parse_until_statement(): Stmt {
        this.eat();

        this.expect(TokenType.OpenParen, "Expected '(' after until statement");

        const test = this.parse_expr();

        this.expect(TokenType.CloseParen, "Expected closing ')' after expression");

        const body = this.parse_block_statement();

        return {kind: "UntilStatement", test, body} as UntilStatement;
    }

    private parse_for_statement(): Stmt {
        this.eat();

        this.expect(TokenType.OpenParen, "Expected '(' after for keyword");

        const init = this.parse_var_declaration();
        const test = this.parse_expr();

        this.expect(TokenType.Semicolon, "Expected ';' after expression");

        const update = this.parse_expr();
        this.expect(TokenType.CloseParen, "Expected ')' to close for stmt");

        const body = this.parse_block_statement();

        return {kind: "ForStatement", init, test, update, body} as ForStatement;
    }

    private parse_while_statement(): Stmt {
        this.eat();

        this.expect(TokenType.OpenParen, "Expected '(' after while statement");

        const test = this.parse_expr();

        this.expect(TokenType.CloseParen, "Expected closing ')' after expression");

        const body = this.parse_block_statement();

        return {kind: "WhileStatement", test, body} as WhileStatement;
    }

    private parse_if_statement(): Stmt {
        this.eat();

        this.expect(TokenType.OpenParen, "Expected '(' after if statement");

        const test = this.parse_expr();

        this.expect(TokenType.CloseParen, "Expected closing ')' after expression");

        const body = this.parse_block_statement();

        let alternate: Stmt[] = [];

        if (this.at().type == TokenType.Else){
            this.eat();

            if (this.at().type == TokenType.If){
                alternate = [this.parse_if_statement()]
            } else {
                alternate = this.parse_block_statement();
            }
        }

        return {kind: "IfStatement", test, body, alternate} as IfStatement;
    }

    private parse_fn_declaration(): Stmt {
        this.eat();

        const name = this.expect(TokenType.Identifier, "Expected function name following 'func'").value;

        const args = this.parse_args();
        const params: string[] = [];

        for (const arg of args){
            if (arg.kind !== "Identifier"){
                console.log(arg);
                throw "Inside function wrong params are set";
            }

            params.push((arg as Identifier).symbol);
        }

        const body = this.parse_block_statement();

        const fn = {body, name, parameters: params, kind: "FunctionDeclaration"} as FunctionDeclaration;

        return fn;
    }

    private parse_class_declaration(): Stmt {
        this.eat(); // class

        const name = this.expect(TokenType.Identifier, "Expected class name after 'class' keyword").value;

        this.expect(TokenType.OpenBrace, "Expected '{' after class name");

        const methods: FunctionDeclaration[] = [];
        const properties: VarDeclaration[] = [];

        while (this.at().type !== TokenType.CloseBrace) {
            if (this.at().type === TokenType.Fn) {
                methods.push(this.parse_fn_declaration() as FunctionDeclaration);
            } else if (this.at().type === TokenType.Let || this.at().type === TokenType.Const) {
                properties.push(this.parse_var_declaration() as VarDeclaration);
            } else {
                throw new Error(`Unexpected token in class ${this.at()}`)
            }
        }

        this.eat();

        return {kind: "ClassDeclaration", name, methods, properties} as ClassDeclaration;
    }

    private parse_new_expr(): Expr {
        this.eat(); // new

        const className = this.expect(TokenType.Identifier, "Expected class name after 'new'").value;

        const args = this.parse_args();

        return { kind: "NewExpr", className, args } as NewExpr;
    }

    private parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Expected identifier name after let | const keyword.").value;

        if (this.at().type == TokenType.Semicolon){
            this.eat(); // Eats the token
            if (isConstant)
                console.error("const variable cannot be declared without a value");

            return {kind: "VarDeclaration", identifier, constant: false, value: undefined} as VarDeclaration;
        }

        this.expect(TokenType.Equals, "Expected equals '=' after var declaration");

        const declaration = {kind: "VarDeclaration", value: this.parse_expr(), identifier, constant: isConstant} as VarDeclaration;

        this.expect(TokenType.Semicolon, "Statements must end with semi-colon ';'")

        return declaration;
    }

    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();

        if (this.at().type == TokenType.Equals){
            this.eat();
            const value = this.parse_assignment_expr();

            return {value, assigne: left, kind: "AssignmentExpr"} as AssignmentExpr;
        }

        return left;
    }

    private parse_object_expr(): Expr {
        if (this.at().type == TokenType.New){
            return this.parse_new_expr();
        }

        if (this.at().type !== TokenType.OpenBrace){
            return this.parse_comparison_expr();
        }

        this.eat();

        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type != TokenType.CloseBrace){
            const key = this.expect(TokenType.Identifier, "Object literal key expected").value;

            if (this.at().type == TokenType.Comma){
                this.eat();
                properties.push({key, kind: "Property", value: undefined} as Property);
                continue;
            } else if (this.at().type == TokenType.CloseBrace){
                properties.push({key, kind: "Property"} as Property);
                continue;
            }

            this.expect(TokenType.Colon, "Missing colon ':' following object expr");

            const value = this.parse_expr();

            properties.push({kind: "Property", value, key});

            if (this.at().type != TokenType.CloseBrace){
                this.expect(TokenType.Comma, "Expected comma or closing bracket following property");
            }
        }

        this.expect(TokenType.CloseBrace, "Expected closing brace for Object literal");

        return { kind: "ObjectLiteral", properties} as ObjectLiteral;
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-"){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();

            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_call_member_expr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%"){
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();

            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_comparison_expr(): Expr {
        let left = this.parse_additive_expr();

        while (this.at().value == ">" || this.at().value == "<" ||
        this.at().value == "==" || this.at().value == ">=" || this.at().value == "<="){
            const operator = this.eat().value;

            const right = this.parse_additive_expr();

            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }

        return left;
    }

    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr();

        if (this.at().type == TokenType.OpenParen){
            return this.parse_call_expr(member);
        }

        return member;
    }

    private parse_call_expr(caller: Expr): Expr {
        let call_expr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args(),

        } as CallExpr;

        if (this.at().type == TokenType.OpenParen){
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open parentheses");

        const args = this.at().type == TokenType.CloseParen ? [] : this.parse_arguments_list();

        this.expect(TokenType.CloseParen, "Missing closing parentheses");

        return args;
    }

    private parse_arguments_list(): Expr[] {
        const args = [this.parse_expr()];

        while (this.at().type == TokenType.Comma && this.eat()){
            args.push(this.parse_assignment_expr());
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (this.at().type === TokenType.Dot) {
            this.eat();
            const property = this.expect(TokenType.Identifier, "Expected property name after '.'").value;
            object = { kind: "MemberExpr", object, property } as MemberExpr;
        }

        while (this.at().type === TokenType.OpenBracket){
            this.eat();

            const index = this.parse_expr();

            this.expect(TokenType.CloseBracket, "Expected ']' in indexing");

            object = {kind: "ArrayIndexExpr", object, index} as ArrayIndexExpr;
        }

        return object;
    }

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return {kind: "Identifier", symbol: this.eat().value} as Identifier;
            case TokenType.Number:
                return {kind: "NumericLiteral", value: parseFloat(this.eat().value)} as NumericLiteral;
            case TokenType.OpenParen: {
                this.eat();
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen,
                    "Error inside parentheses expression. Are you missing a ')' ?"
                );
                return value;
            }
            case TokenType.String:
                return { kind: "StringLiteral", value: this.eat().value } as StringLiteral;

            case TokenType.OpenBracket:
                return this.parse_array_expr();

            default:
                console.error("Unexpected Token Found during parsing: ", this.at());
                process.exit(1);
        }
    }
}

