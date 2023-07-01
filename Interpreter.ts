import { readFileSync } from 'fs'

export default class Interpreter {
    
    private lexProgram(programBuffer: string) {
        console.log(programBuffer);
    }

    runProgram(programFile: string) {
        
        const programBuffer: string = readFileSync(programFile).toString();
        this.lexProgram(programBuffer);
    }
}