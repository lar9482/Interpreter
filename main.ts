import Interpreter from "./Interpreter";

const interpreter: Interpreter = new Interpreter();
interpreter.runProgram("./ProgramTests/Parser_Tests/block_WITHOUT_STATEMENTS.decaf");
//interpreter.runProgram("./ProgramTests/add.decaf")