import { readFileSync } from 'fs'
import Lexer from './Lexer/Lexer'

export default class Interpreter {

    private lexProgram(programBuffer: string) {
        const lexer: Lexer = new Lexer();

        lexer.scanProgram(programBuffer);
    }

    runProgram(programFile: string) {
        
        const programBuffer: string = readFileSync(programFile, 'utf-8').toString();
        this.lexProgram(programBuffer);
    }
}