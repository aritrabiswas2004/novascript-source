"""
** SPDX-License-Identifier: Apache-2.0 **

NovaScript - Test Numeric Expressions

Tests of NumExpr with Grammar

Copyright (c) 2025 Aritra Biswas
All Rights Reserved.

Author: Aritra Biswas <aritrabb@gmail.com>

"""

from test_grammar import test_expression

"""
Expressions here are going to be added as per the call stack

AdditiveExpr
MultiplicativeExpr
PrimaryExpr
"""

# Primary Expr
test_expression("4", True)

# Binary Expr
test_expression("1 + 2", True)
test_expression("2 - 4", True)
test_expression("9 - ", False)

# Mix

test_expression("1 + 2 + 3", True)
test_expression("1 2 + 3", False)



