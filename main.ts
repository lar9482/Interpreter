import Interpreter from "./Interpreter";

const interpreter: Interpreter = new Interpreter();
interpreter.runProgram("./ProgramTests/Lexer_Tests/basic_symbols.decaf");
//interpreter.runProgram("./ProgramTests/add.decaf")