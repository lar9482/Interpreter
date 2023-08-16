import ProgramAST from "../AST/ProgramAST";

import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import miscAnalysisVisitorInterface from "./MiscAnalysisVisitorInterface";
import { SymbolType } from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolType";
import { DecafType } from "../AST/DecafType";
import VarDeclAST from "../AST/VarDeclAST";

/**
 * As part of the final static analysis pass, this visitor will traverse over the AST once again,
 * to catch invalid features that weren't caught during type-checking.
 * 
 * The invalid features that this visitor will catch include the following:
 *  1. No main function that returns an integer.
 *  2. Void variable declarations.
 *  3. Undefined variables in locations.
 *  4. Variable array declarations of size zero.
 *  5. Location array accesses without an index
 *  6. All break and continue statements outside of a loop.
 */
export default class MiscAnalysisVisitor implements miscAnalysisVisitorInterface {

    private symbolTableStack: SymbolTable[] = [];
    private errorMessages: ErrorMessage[] = [];

    applyAdditionalStaticAnalysis(programAST: ProgramAST) {
        programAST.acceptAnalyzeElement(this);
    }

    analyzeProgram(programAST: ProgramAST) {

        this.symbolTableStack.push(programAST.symbols);

        const mainFunctionSymbol: Symbol | undefined
            = this.getSymbolFromCurrentTable('main', programAST.sourceLineNumber);

        if (mainFunctionSymbol) {
            if (mainFunctionSymbol.symbolType === SymbolType.FUNCTION_SYMBOL) {
                if (mainFunctionSymbol.returnType !== DecafType.INT) {
                    this.errorMessages.push(
                        new ErrorMessage(`The 'main' function doesn't return an integer`)
                    );
                }
            }
        } else {
            this.errorMessages.push(
                new Error(`The 'main' function was not found`)
            );
        }
        
        programAST.variables.forEach((varDeclAST: VarDeclAST) => {
            varDeclAST.acceptAnalyzeElement(this)
        });

        this.symbolTableStack.pop();
    }

    analyzeVarDecl(varDeclAST: VarDeclAST) {

        if (varDeclAST.decafType === DecafType.VOID) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${varDeclAST.sourceLineNumber}: Variable declaration ${varDeclAST.name} has a 'void' type.`)
            );
        }

        if (varDeclAST.isArray) {
            if (varDeclAST.arrayLength === 0) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${varDeclAST.sourceLineNumber}: Invalid size declaration for ${varDeclAST.name}. Make sure the array size is greater than 0.`)
                );
            }
        }
    }

    private getSymbolFromCurrentTable(symbolName: string, lineNumber: number): Symbol | undefined {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length - 1];
        const symbol: Symbol | undefined = currentSymbolTable.lookupSymbolName(symbolName);

        return symbol;
    }
}