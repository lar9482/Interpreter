# What is this?
This is my first implementation of a programming language :)

NOTE:
As of writing this README.md, this language is more or less an implementation of Dr Mike Lam's Decaf programming language. I definitely want to expand on his language and add my own features.

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
    return 0;
}
```

### How to run this program.
1. Clone this repo
2. Run 'npm install'
3. Copy this program into a text file {yourProgramName}.decaf
4. Navigate to the root of the project and run the following command.
   * ts-node main.ts ./{yourSubDirectory}/{yourProgramName}.decaf
   * https://www.youtube.com/watch?v=-XGhfFMdsek

# High level overview of how the interpreter works.
  ## Lexical Analysis
      This phase will take in the raw text of a file to break it into a queue of tokens. 
      In more complex languages, this phase will typically modelled as a finite state machine.
      However, the syntax of this toy language was simple enough to divide the raw text using only regular expressions.

  ## Syntactic Analysis
      This phase will take in the queue of tokens generated from the 'Lexical Analysis' phase and build out an Abstract Syntax Tree(AST). 
      The AST is built out using a recursive descent parser. 
      
      Bascially, how a recursive descent parser works it that it reads one token at a time, 
      then maps it out based on the grammar of the language. 

      The recursive descent parser essentially models the grammar of the language by
      implementing a function for almost every single grammar rule, 
      in order to predict how tokens will be mapped to the relevant parts of the AST.

      The grammar rules basically describe how the language should be structured. It describes how constructs
      such as variables, assignments, loops, expressions, and functions should be structured. 
      

  ## Semantic Analysis
      This phase will take AST generated from the 'Syntactic Analysis' phase and check it for invalid 
      features that not specified in the language by making multiple traversals.

      First, it will build out symbol tables for the main program, the functions, and nested blocks
      in order to keep track of the program's scope. Basically, a reference to every variable and function
      will be cached in the symbol tables. 

      Next, the AST is type-checked to ensure correctness in every expression embedded within the AST.
        
      Finally, the AST is checked for miscellaneous invalid features. These include 
          - Programs without a 'main' function
          - Variable declarations with the 'void' type.
          - Variable array declarations of size zero.
          - Array accesses without an index.
      

  ## Interpretation
     This phase will take the checked AST from the 'Semantic Analysis' phase and actually execute it.
  
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
  - Implement more types such as floats, strings, etc.
  - Implement common language constructs, like 'for' loops, 'do-while' loops, 'switch' statements, etc.
  - Allow arrays to be passed into functions as parameters and returned from functions.
  - Expand the interpreter to some sort of bytecode interpreter with an IR instruction set. Basically, a compiler that targets bytecode for a VM.
        - Integrate 'jump' constructs and other non-trivial language features into the prospective bytecode interpreter.
    
        - NOTE: 'Jump' constructs are statements such as 'break', 'continue', and 'goto', which are hard to implement in an AST-walking interpreter.
        - NOTE: The other main non-trivial construct besides 'jump' constructs I want to implement is recursion. This proved rather difficult to integrate into the interpreter as it stands.

<a id="Credit-To-Lam"></a>
# Credit
I owe so much credit to Dr. Mike Lam at James Madison University. I consulted Dr. Lam's Decaf programming language for his 'compilers' course as a bootstrap for my own. Moreover, the documentation for his language is fantastic. 

Please see the documentation for the original language [here](https://w3.cs.jmu.edu/lam2mo/cs432/files/decaf_ref.pdf)

