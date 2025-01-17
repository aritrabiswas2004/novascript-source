/* SPDX-License-Identifier: Apache-2.0 */
/*
 * NovaScript - Lexer
 *
 * Creates tokens based on individual characters or keywords.
 *
 * Copyright (c) 2025 Aritra Biswas
 * All Rights Reserved.
 *
 * Author: Aritra Biswas <aritrabb@gmail.com>
 */


export enum TokenType {
    Number,
    Identifier,
    Equals,
    Comma, Colon,
    OpenParen, CloseParen,
    OpenBrace, CloseBrace,
    OpenBracket, CloseBracket,
    Dot,
    BinaryOperator,
    Let,
    Const,
    If, Else,
    While, For, Until,
    Fn,
    EOF,
    Semicolon,
    String,
    Try, Catch
}

const KEYWORDS: Record<string, TokenType> = {
    "mut": TokenType.Let,
    "const" : TokenType.Const,
    "func": TokenType.Fn,
    "if": TokenType.If,
    "else": TokenType.Else,
    "while": TokenType.While,
    "for": TokenType.For,
    "until": TokenType.Until,
    "try": TokenType.Try,
    "catch": TokenType.Catch
}

const ESCAPED: Record<string, string> = {
    n: "\n",
    t: "\t",
    r: "\r"
}

export interface Token {
    value: string,
    type: TokenType
}

function token(value = "", type: TokenType): Token {
    return {value, type};
}

function isalpha(src: string): boolean {
    return src.toUpperCase() != src.toLowerCase();
}

function isint(str: string){
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    return (c >= bounds[0] && c <= bounds[1]);
}

function isskippable(str: string){
    return (str == ' ' || str == '\n' || str== '\t' || str == '\r');
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    while (src.length > 0){
        if (src[0] == '('){
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ')'){
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (src[0] == '{'){
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        } else if (src[0] == '}') {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        } else if (src[0] == '['){
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        } else if (src[0] == ']') {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        } else if (
            src[0] == '+'
            || src[0] == '-'
            || src[0] == '*'
            || src[0] == '/'
            || src[0] == '%'
            || src[0] == '>'
            || src[0] == '<'
        ){
            if ((src[0] == ">" || src[0] == "<") && src[1] == "="){
                const operation = src.shift() + src.shift();
                tokens.push(token(operation, TokenType.BinaryOperator));
            } else if (src[0] == '/' && src[1] == '/'){
                do {
                    src.shift();
                } while (src.length > 0 && (src[0] as string) != "\n");
                src.shift();
            } else if (src[0] == '/' && src[1] == '('){
                do {
                    src.shift();
                } while (src.length > 0 && (src[0] as string) != ")" && (src[1] as string) != "/");
                src.shift();
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        } else if (src[0] == '='){
            if (src[1] == '='){
                const doubleEquals = src.shift() + src.shift();
                tokens.push(token(doubleEquals, TokenType.BinaryOperator));
            } else {
                tokens.push(token(src.shift(), TokenType.Equals));
            }
        } else if (src[0] == ';'){
            tokens.push(token(src.shift(), TokenType.Semicolon));
        } else if (src[0] == ':'){
            tokens.push(token(src.shift(), TokenType.Colon));
        } else if (src[0] == ','){
            tokens.push(token(src.shift(), TokenType.Comma));
        } else if (src[0] == '.') {
            tokens.push(token(src.shift(), TokenType.Dot));
        } else if (src[0] == '"'){
            src.shift();

            let str = "";
            let raw = "";

            let escaped = false;

            while (src.length > 0 && src[0] != '"'){
                const key = src.shift();
                raw += key;

                if (key == "\\"){
                    escaped = !escaped
                    if (escaped) continue;
                } else if (escaped){
                    escaped = false;

                    if (ESCAPED[key]){
                        str += ESCAPED[key];
                        continue;
                    } else {
                        str += `\\`;
                    }
                }

                str += key;
            }

            src.shift(); // get rid of trailing double quotes ' " '

            tokens.push(token(str, TokenType.String));
        } else {

            if (isint(src[0])){
                let num = "";

                while (src.length > 0 && isint(src[0])){
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number))
            } else if (isalpha(src[0])){
                let ident: string = "";

                while (src.length > 0 && isalpha(src[0])){
                    ident += src.shift();
                }

                const reserved: TokenType = KEYWORDS[ident];

                if (reserved == undefined) {
                    tokens.push(token(ident, TokenType.Identifier));
                } else {
                    tokens.push(token(ident, reserved));
                }
            } else if (isskippable(src[0])){
                src.shift();
            } else {
                console.error("Unrecognized char found in source: ", src[0].charCodeAt(0));
                process.exit(1);
            }
        }
    }

    tokens.push(token("EndOfFile", TokenType.EOF));

    return tokens;
}
