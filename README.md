# What is this?
This is my first implementation of a programming language :)

NOTE:
As of writing this README.md, this language is more or less an implementation of Dr Mike Lam's Decaf programming language.

Please see [credit](#Credit-To-Lam).

# Sample Program
```
def void fizzbuzz(int n) {

    int num;
    num = 1;

    while (num < n) {
        if (num % 3 == 0 || num % 5 == 0) {
            if (num % 3 == 0) {
                print_str("Fizz");
            }

            if (num % 5 == 0) {
                print_str("Buzz");
            }
        } else {
            print_int(num);
        }
        print_str("");

        num = num + 1;
    }
}

def int main() {
    fizzbuzz(10);
    print_bool((true && false) || (true || false));
    return 0;
}
```

### How to run this program.
1. Clone this repo
2. Run 'npm install'
3. Copy this program into a text file {yourProgramName}.decaf
4. Navigate to the root of the project and run the following command.
   * ts-node main.ts ./{yourSubDirectory}/{yourProgramName}.decaf

# Features

## Types
  - Integers
  - Booleans

## Expressions
  - Support for binary expressions and unary expressions.
  - Full precedence evaluation using infex notation.
  - +, -, *, %, <, <=, >, >= operators for integers
  - &&, ||, ! for booleans.
  - ==, != for both booleans and integers.
    
```
  (5 + 2) * 10 / 2
  >>> 35

  (true && false) || (true || false)
  >>> true
```

## Variable declarations
  - Variables can either be a single location, or mutiple locations(an array)

    ```
      int scalar;
      int array[100];
      bool booleanVariable;
    ```

## Plans for later
  - Implement deep copys in the scope stack in order for recursion to run properly.
  - Implement more types such as floats, strings, etc
  - Implement common language constructs, mainly the for loop
  - Expand the interpreter to some sort of bytecode interpreter. Basically, a compiler that targets bytecode for a VM.

<a id="Credit-To-Lam"></a>
# Credit
I owe so much credit to Dr. Mike Lam at James Madison University. I consulted Dr. Lam's Decaf programming language for his 'compilers' course as a bootstrap for my own. Moreover, the documentation for his language is fantastic. 

Please see the documentation for the original language [here](https://w3.cs.jmu.edu/lam2mo/cs432/files/decaf_ref.pdf)

