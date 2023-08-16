import ProgramAST from "../AST/ProgramAST";

import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import miscAnalysisVisitorInterface from "./MiscAnalysisVisitorInterface";
import { SymbolType } from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolType";
import { DecafType } from "../AST/DecafType";
import FuncDeclAST from "../AST/FuncDeclAST";
import SymbolArray from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolArray";
import BlockAST from "../AST/BlockAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import AST from "../AST/AST";
import { NodeType } from "../AST/NodeType";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import BreakStmtAST from "../AST/StmtAST/BreakStmtAST";
import ContinueStmtAST from "../AST/StmtAST/ContinueStmtAST";

/**
 * As part of the final static analysis pass, this visitor will traverse over the AST
 * to catch invalid features that weren't caught during symbol table construction and type-checking.
 * 
 * The invalid features that this visitor will catch include the following:
 *  1. No main function that returns an integer.
 *  2. Void variable declarations.
 *  3. Undefined variables in locations.
 *  4. Variable array declarations of size zero.
 *  5. Location array accesses without an index.
 *  6. All break and continue statements outside of a loop.
 * 
 * NOTE:
 * For better debug information, 
 * this visitor will check the AST nodes directly, not symbols stored in the symbol tables.
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
        
        programAST.symbols.table.forEach((symbol: Symbol) => {
            this.checkSymbolValidity(symbol);
        })

        programAST.functions.forEach((funcDeclAST: FuncDeclAST) => {
            funcDeclAST.acceptAnalyzeElement(this);
        })

        this.symbolTableStack.pop();
    }

    analyzeFuncDecl(funcDeclAST: FuncDeclAST) {
        this.symbolTableStack.push(funcDeclAST.symbols);

        funcDeclAST.symbols.table.forEach((symbol: Symbol) => {
            this.checkSymbolValidity(symbol);
        })
        funcDeclAST.body.acceptAnalyzeElement(this);

        this.symbolTableStack.pop();
    }

    analyzeBlock(blockAST: BlockAST) {
        this.symbolTableStack.push(blockAST.symbols);

        blockAST.symbols.table.forEach((symbol: Symbol) => {
            this.checkSymbolValidity(symbol);
        });

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.ASSIGNMENT) {

            } else if (stmtAST.type === NodeType.CONDITIONAL) {

            } else if (stmtAST.type === NodeType.WHILELOOP) {

            } else if (stmtAST.type === NodeType.RETURNSTMT) {

            } else if (stmtAST.type === NodeType.BREAKSTMT) {

            } else if (stmtAST.type === NodeType.CONTINUESTMT) {

            }
        });

        this.symbolTableStack.pop();
    }

    analyzeAssignStmt(assignStmtAST: AssignStmtAST) {
        
    }

    analyzeConditionalStmt(conditionalStmtAST: ConditionalStmtAST) {

    }

    analyzeWhileLoopStmt(whileLoopStmtAST: WhileLoopStmtAST) {

    }

    analyzeReturnStmt(returnStmtAST: ReturnStmtAST) {

    }

    analyzeBreakStmt(breakStmtAST: BreakStmtAST) {

    }

    analyzeContinueStmt(continueStmtAST: ContinueStmtAST) {

    }

    private checkSymbolValidity(symbol: Symbol) {
        if (symbol.symbolType === SymbolType.SCALAR_SYMBOL) {
            if (symbol.returnType === DecafType.VOID) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${symbol.sourceLineNumber}: ${symbol.name} has a 'void' type.`)
                );
            }
        } else if (symbol.symbolType === SymbolType.ARRAY_SYMBOL) {
            const symbolArray: SymbolArray = symbol as SymbolArray;

            if (symbolArray.returnType === DecafType.VOID) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${symbol.sourceLineNumber}: ${symbolArray.name} has a 'void' type.`)
                );
            }

            if (symbolArray.length === 0) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${symbol.sourceLineNumber}: Invalid size declaration for ${symbolArray.name}. Make sure the array size is greater than 0.`)
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