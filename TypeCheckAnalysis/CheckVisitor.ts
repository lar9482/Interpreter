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
import { NodeType } from "../AST/NodeType";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";

/**
 * As part of the second pass for type checking, this visitor will make post-order
 * traversals over statements and expressions to actually check the types.
 */
export default class CheckVisitor implements checkVisitorInterface {
    private symbolTableStack: SymbolTable[] = [];

    checkTypes(programAST: ProgramAST) {
        this.checkProgram(programAST);
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

    }

    checkAssignSmt(assignStmtAST: AssignStmtAST) {

    }

    checkWhileStmt(whileLoopStmtAST: WhileLoopStmtAST) {

    }

    checkReturnStmt(returnStmtAST: ReturnStmtAST) {

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
}