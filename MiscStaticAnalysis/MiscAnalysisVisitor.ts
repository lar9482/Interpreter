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
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import ExprAST from "../AST/ExprAST/ExprAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import LocAST from "../AST/ExprAST/LocAST";

/**
 * As part of the final static analysis pass, this visitor will traverse over the AST
 * to catch invalid features that weren't caught during symbol table construction and type-checking.
 * 
 * The invalid features that this visitor will catch include the following:
 *  1. No main function that returns an integer.
 *  2. Void variable declarations.
 *  3. Variable array declarations of size zero.
 *  4. Location array accesses without an index.
 *  5. All break and continue statements outside of a loop.
 * 
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
            = this.getSymbolFromCurrentTable('main');

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
                const assignStmtAST: AssignStmtAST = stmtAST as AssignStmtAST;
                assignStmtAST.acceptAnalyzeElement(this);

            } else if (stmtAST.type === NodeType.CONDITIONAL) {
                const conditionalStmtAST: ConditionalStmtAST = stmtAST as ConditionalStmtAST;
                conditionalStmtAST.acceptAnalyzeElement(this);

            } else if (stmtAST.type === NodeType.WHILELOOP) {
                const whileLoopStmtAST: WhileLoopStmtAST = stmtAST as WhileLoopStmtAST;
                whileLoopStmtAST.acceptAnalyzeElement(this);

            } else if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                returnStmtAST.acceptAnalyzeElement(this);

            } else if (stmtAST.type === NodeType.BREAKSTMT) {
                const breakStmtAST: BreakStmtAST = stmtAST as BreakStmtAST;
                breakStmtAST.acceptAnalyzeElement(this);

            } else if (stmtAST.type === NodeType.CONTINUESTMT) {
                const continueStmtAST: ContinueStmtAST = stmtAST as ContinueStmtAST;
                continueStmtAST.acceptAnalyzeElement(this);

            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptAnalyzeElement(this);

            }
        });

        this.symbolTableStack.pop();
    }

    analyzeAssignStmt(assignStmtAST: AssignStmtAST) {
        assignStmtAST.location.acceptAnalyzeElement(this);
        assignStmtAST.value.acceptAnalyzeElement(this);
    }

    analyzeConditionalStmt(conditionalStmtAST: ConditionalStmtAST) {
        conditionalStmtAST.condition.acceptAnalyzeElement(this);
        conditionalStmtAST.ifBlock.acceptAnalyzeElement(this);
        conditionalStmtAST.elseBlock?.acceptAnalyzeElement(this);
    }

    analyzeWhileLoopStmt(whileLoopStmtAST: WhileLoopStmtAST) {
        whileLoopStmtAST.condition.acceptAnalyzeElement(this);
        whileLoopStmtAST.body.acceptAnalyzeElement(this);
    }

    analyzeReturnStmt(returnStmtAST: ReturnStmtAST) {
        returnStmtAST.returnValue?.acceptAnalyzeElement(this);
    }

    analyzeBreakStmt(breakStmtAST: BreakStmtAST) {
        if (!this.isDescendantOfCurrentTable(NodeType.WHILELOOP)) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${breakStmtAST.sourceLineNumber}: Break statement occurred outside of a loop.`)
            );
        }
    }

    analyzeContinueStmt(continueStmtAST: ContinueStmtAST) {
        if (!this.isDescendantOfCurrentTable(NodeType.WHILELOOP)) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${continueStmtAST.sourceLineNumber}: Continue statement occurred outside of a loop.`)
            );
        }
    }

    //Expressions to analyze(because they contain locations).
    analyzeExpr(exprAST: ExprAST) {
        if (exprAST.type === NodeType.BINARYOP) {
            const binaryExprAST: BinaryExprAST = exprAST as BinaryExprAST;
            binaryExprAST.acceptAnalyzeElement(this);

        } else if (exprAST.type === NodeType.UNARYOP) {
            const unaryExprAST: UnaryExprAST = exprAST as UnaryExprAST;
            unaryExprAST.acceptAnalyzeElement(this);

        } else if (exprAST.type === NodeType.FUNCCALL) {
            const funcCallExprAST: FuncCallAST = exprAST as FuncCallAST;
            funcCallExprAST.acceptAnalyzeElement(this);

        } else if (exprAST.type === NodeType.LOCATION) {
            const locExprAST: LocAST = exprAST as LocAST;
            locExprAST.acceptAnalyzeElement(this);
        }
    }

    analyzeBinaryExpr(binaryExprAST: BinaryExprAST) {
        binaryExprAST.left.acceptAnalyzeElement(this);
        binaryExprAST.right.acceptAnalyzeElement(this)
    }

    analyzeUnaryExpr(unaryExprAST: UnaryExprAST) {
        unaryExprAST.child.acceptAnalyzeElement(this);
    }

    analyzeFuncCall(funcCallAST: FuncCallAST) {
        funcCallAST.funcArguments.forEach((funcArgExprAST: ExprAST) => {
            funcArgExprAST.acceptAnalyzeElement(this);
        })
    }

    analyzeLoc(locAST: LocAST) {
        const locSymbol: Symbol | undefined = this.getSymbolFromCurrentTable(locAST.name);

        if (locSymbol === undefined) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${locAST.sourceLineNumber}: ${locAST.name} wasn't initialized in the current scope.`)
            );
        }

        if (locSymbol?.symbolType === SymbolType.ARRAY_SYMBOL) {
            if (locAST.index === undefined) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${locAST.sourceLineNumber}: The array access for ${locAST.name} doesn't have an index expression.`)
                );
            }
        }
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

    private getSymbolFromCurrentTable(symbolName: string): Symbol | undefined {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length - 1];
        const symbol: Symbol | undefined = currentSymbolTable.lookupSymbolName(symbolName);

        return symbol;
    }

    private isDescendantOfCurrentTable(containerType: NodeType): boolean {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length - 1];
        return currentSymbolTable.isDescendantOf(containerType);
    }
}