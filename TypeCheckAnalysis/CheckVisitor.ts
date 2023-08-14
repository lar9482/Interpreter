import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import LocAST from "../AST/ExprAST/LocAST";
import AST from "../AST/AST";

import checkVisitorInterface from "./CheckVisitorInterface";

import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";
import { NodeType } from "../AST/NodeType";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import ExprAST from "../AST/ExprAST/ExprAST";
import { DecafType } from "../AST/DecafType";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

/**
 * As part of the second pass for type checking, this visitor will make post-order
 * traversals over statements and expressions to actually check the types.
 */
export default class TypeCheckVisitor implements checkVisitorInterface {
    private symbolTableStack: SymbolTable[] = [];
    private errorMessages: ErrorMessage[] = [];

    checkTypes(programAST: ProgramAST) {
        programAST.acceptCheckElement(this);
    }

    //Base nodes for the visitor
    checkProgram(programAST: ProgramAST) {
        this.symbolTableStack.push(programAST.symbols);

        programAST.functions.forEach((functionAST: FuncDeclAST) => {
            functionAST.acceptCheckElement(this);
        });

        this.symbolTableStack.pop();
    }

    checkFuncDecl(funcDeclAST: FuncDeclAST) {
        this.symbolTableStack.push(funcDeclAST.symbols);

        funcDeclAST.body.acceptCheckElement(this);

        this.symbolTableStack.pop();
    }

    checkBlock(blockAST: BlockAST) {
        this.symbolTableStack.push(blockAST.symbols);

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.CONDITIONAL) {
                const conditionalStmtAST: ConditionalStmtAST = stmtAST as ConditionalStmtAST;
                conditionalStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.ASSIGNMENT) {
                const assignStmtAST: AssignStmtAST = stmtAST as AssignStmtAST;
                assignStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.WHILELOOP) {
                const whileLoopStmtAST: WhileLoopStmtAST = stmtAST as WhileLoopStmtAST;
                whileLoopStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                returnStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptCheckElement(this);
            }
        });

        this.symbolTableStack.pop();
    }

    //Stmts that need to be type checked.
    checkConditionalStmt(conditionalStmtAST: ConditionalStmtAST) {

        conditionalStmtAST.ifBlock.acceptCheckElement(this);
        conditionalStmtAST.elseBlock?.acceptCheckElement(this);
        conditionalStmtAST.condition.acceptCheckElement(this);
        
        if (conditionalStmtAST.condition.decafType === DecafType.BOOL) {
            return;
        } else {
            this.errorMessages.push(
                new ErrorMessage(`Line ${conditionalStmtAST.sourceLineNumber}: The conditional in the if statement is not a boolean type.`)
            );

            return;
        }
    }

    checkAssignSmt(assignStmtAST: AssignStmtAST) {
        assignStmtAST.location.acceptCheckElement(this);
        assignStmtAST.value.acceptCheckElement(this);

        const currAssignSymbol: Symbol = this.getSymbolFromCurrentTable(assignStmtAST.location.name, assignStmtAST.sourceLineNumber);

        if (assignStmtAST.location.decafType !== currAssignSymbol.returnType) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${assignStmtAST.sourceLineNumber}: The location type does not match.`)
            );
        }

        if (assignStmtAST.value.decafType !== currAssignSymbol.returnType) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${assignStmtAST.sourceLineNumber}: The location type does not match with the assignment expression`)
            );  
        } 

        if (assignStmtAST.location.index !== undefined) {
            if (assignStmtAST.location.index.decafType !== DecafType.INT) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${assignStmtAST.sourceLineNumber}: The index expression not an integer.`)
                );
            }
        }
    }

    checkWhileStmt(whileLoopStmtAST: WhileLoopStmtAST) {
        whileLoopStmtAST.condition.acceptCheckElement(this);
        whileLoopStmtAST.body.acceptCheckElement(this);

        if (whileLoopStmtAST.condition.decafType === DecafType.BOOL) {
            return;
        } else {
            this.errorMessages.push(
                new ErrorMessage(`Line ${whileLoopStmtAST.sourceLineNumber}: The conditional for the while loop is not a boolean type.`)
            );

            return;
        }
    }

    checkReturnStmt(returnStmtAST: ReturnStmtAST) {

    }

    checkExpr(exprAST: ExprAST) {
        if (exprAST.type === NodeType.BINARYOP) {
            const binaryExprAST: BinaryExprAST = exprAST as BinaryExprAST;
            binaryExprAST.acceptCheckElement(this);

        } else if (exprAST.type === NodeType.UNARYOP) {
            const unaryExprAST: UnaryExprAST = exprAST as UnaryExprAST;
            unaryExprAST.acceptCheckElement(this);

        } else if (exprAST.type === NodeType.FUNCCALL) {
            const funcCallExprAST: FuncCallAST = exprAST as FuncCallAST;
            funcCallExprAST.acceptCheckElement(this);

        } else if (exprAST.type === NodeType.LOCATION) {
            const locExprAST: LocAST = exprAST as LocAST;
            locExprAST.acceptCheckElement(this);
        }
    }

    //Exprs that need to be type checked.
    checkBinaryExpr(binaryExprAST: BinaryExprAST) {

    }

    checkUnaryExpr(unaryExprAST: UnaryExprAST) {

    }

    checkFuncCall(funcCallAST: FuncCallAST) {

    }

    checkLoc(locAST: LocAST) {
        
    }

    private getSymbolFromCurrentTable(symbolName: string, lineNumber: number) {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length-1];
        const symbol: Symbol | undefined = currentSymbolTable.lookupSymbolName(symbolName);

        if (symbol !== undefined) {
            return symbol as Symbol;
        } else {
            throw new Error(`Line ${lineNumber}: The symbol '${symbolName}' is undefined in the current context. Unable to check its type`);
        }
    }
}