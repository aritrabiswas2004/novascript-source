from test_grammar import test_expression

test_expression("mut i = 0;", True)  # No semi-colon
test_expression("const foo = 0;", True)

# Please submit more test cases.

