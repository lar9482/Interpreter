import { readFileSync } from 'fs'
import Token from './Tokens/Token';
import Lexer from './Lexer/Lexer'

export default class Interpreter {

    private lexProgram(programBuffer: string): Token[] {
        const lexer: Lexer = new Lexer();
        return lexer.scanProgram(programBuffer);
    }

    private parseProgram(tokenQueue: Token[]) {

    }

    runProgram(programFile: string) {
        const programBuffer: string = readFileSync(programFile, 'utf-8').toString();
        const tokenQueue: Token[] = this.lexProgram(programBuffer);

        console.log(tokenQueue);
    }
}