# Class

A class is a feature of object-oriented programming (OOP) to create datatypes that are
custom and have specific features. The classes maybe useful when creating objects of
specific datatypes and doing operations on them. NovaScript primary expressions do not
create objects upon definition yet.

## Declaring Classes

A class is declared with a `class` keyword. It is declared as a block expression and no
static content can be declared in a class. 

```javascript
class Main {}
```

### Properties

Properties are variables declared in classes. These variables can only be accessed within
the class or by instantiating a new class and using the `.` operator to access the
property. 

```javascript
class Main {
    const foo = "bar"; // Property
}
```

### Methods

Methods are functions that are declared in a class and they have the same functionality
as properties and can be called by the `.` operator.

```javascript
class Main {
    func foo(){
        return "bar";
    }
}
```

## Constructors

The first OOP concept applied to NovaScript classes is creating constructors. Constructors
create specific values inside your class the moment the class is instantiated so that
each property need not be individually set after class declaration.

In NovaScript constructors are declared using the special `constructor()` method.

All elements within a class can be referenced by the `this` keyword.

```javascript
class Main(){
    
    mut foo = "fizz";
    
    func constructor() {
        this.foo = "buzz";
    }
}
```

## Test Script

```javascript
class Coordinate {
    mut xCoord = 0;
    mut yCoord = 0;

    func constructor(xVal, yVal){
        this.xCoord = xVal;
        this.yCoord = yVal;
    }

    func getX(){
        return this.xCoord;
    }

    func getY(){
        return this.yCoord;
    }

    func printCoord(){
        print("(", xCoord, yCoord, ")");
    }
}

mut point = new Coordinate(26, 4);

print(point.getX());

mut x = 0;
until (x == 10){
    print(x);
    x = x + 1;
}
```

>[!WARNING]
> Feature rollback expected on OOP and processes until parser code is fixed.

> [!NOTE]
> This file will be expanded as more features get added.
