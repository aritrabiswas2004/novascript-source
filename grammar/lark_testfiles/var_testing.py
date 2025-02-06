"""
** SPDX-License-Identifier: Apache-2.0 **

NovaScript - Test Variable Declaration

Tests of Var Decl with Grammar

Copyright (c) 2025 Aritra Biswas
All Rights Reserved.

Author: Aritra Biswas <aritrabb@gmail.com>

"""

# All test must pass

from test_grammar import test_expression

test_expression("mut i = 0", False)  # No semi-colon
test_expression("const foo = 0;", True)

# Please submit more test cases.

