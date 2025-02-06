"""
** SPDX-License-Identifier: Apache-2.0 **

NovaScript - Test Grammar

Lark library to test grammar

Copyright (c) 2025 Aritra Biswas
All Rights Reserved.

Author: Aritra Biswas <aritrabb@gmail.com>

"""

from lark import Lark

with open("../grammar.lark", "r") as file:
    grammar = file.read()

def test_expression(code, eval: bool = True, showtree: bool = False):
    parser = Lark(grammar, start="program")

    try:
        tree = parser.parse(code)
        if eval:
            print(f"case => '{code}' :: eval => {eval} :: PASSED")
            if showtree:
                print(tree.pretty())
        else:
            print(f"case => '{code}' :: eval => {eval} :: FAILED")
    except Exception as e:
        if not eval:
            print(f"case => '{code}' :: eval => {eval} :: PASSED")
        else:
            print(f"case => '{code}' :: eval => {eval} :: FAILED")
            print(e)

