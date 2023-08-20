import { readFileSync } from 'fs'
import Token from './Tokens/Token';
import { TokenType } from './Tokens/TokenType';
import Lexer from './Lexer/Lexer'
import Parser from './Parser/Parser';
import ProgramAST from './AST/ProgramAST';
import SymbolVisitor from './SymbolTableAnalysis/symbolVisitor';
import TypeInferenceVisitor from './TypeInferenceAnalysis/InferenceVisitor';
import TypeCheckVisitor from './TypeCheckAnalysis/CheckVisitor';
import MiscAnalysisVisitor from './MiscStaticAnalysis/MiscAnalysisVisitor';
import InterpretVisitor from './Interpret/InterpretVisitor';

export default class Interpreter {

    private static lexProgram(programBuffer: string): Token[] {
        const lexer: Lexer = new Lexer();
        const tokenQueue: Token[] = lexer.scanProgram(programBuffer);
        
        tokenQueue.push(new Token(
            'ε', TokenType.Token_Epsilon, -1
        ));

        return tokenQueue;
    }

    private static parseProgram(tokenQueue: Token[]): ProgramAST {
        const parser: Parser = new Parser(tokenQueue);
        const AST: ProgramAST = parser.parseProgram();

        return AST;
    }

    private static analyzeProgram(AST: ProgramAST) {
        const symbolTableBuilder: SymbolVisitor = new SymbolVisitor();
        symbolTableBuilder.buildSymbolTables(AST);

        const TypeInferenceAnalyzer: TypeInferenceVisitor = new TypeInferenceVisitor();
        TypeInferenceAnalyzer.inferTypes(AST);

        const TypeCheckAnalyzer: TypeCheckVisitor = new TypeCheckVisitor();
        TypeCheckAnalyzer.checkTypes(AST);

        const MiscellaneousStaticAnalyzer: MiscAnalysisVisitor = new MiscAnalysisVisitor();
        MiscellaneousStaticAnalyzer.applyAdditionalStaticAnalysis(AST);
        
        let errorMessages = " ";
        errorMessages += symbolTableBuilder.errorMessages.join("\n\t");
        errorMessages += TypeInferenceAnalyzer.errorMessages.join("\n\t");
        errorMessages += TypeCheckAnalyzer.errorMessages.join("\n\t");
        errorMessages += MiscellaneousStaticAnalyzer.errorMessages.join("\n\t");
        
        if (errorMessages !== " ") {
            throw new Error(errorMessages);
        }
    }

    private static executeProgram(AST: ProgramAST) {
        const executor: InterpretVisitor = new InterpretVisitor(AST);
        executor.executeProgram();
    }

    static runProgram(programFile: string) {
        const programBuffer: string = readFileSync(programFile, 'utf-8').toString();
        const tokenQueue: Token[] = Interpreter.lexProgram(programBuffer);  
        const AST: ProgramAST = Interpreter.parseProgram(tokenQueue);
        Interpreter.analyzeProgram(AST);
        Interpreter.executeProgram(AST);
    }
}