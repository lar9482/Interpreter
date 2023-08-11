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

import checkVisitorInterface from "./CheckVisitorInterface";

export default class CheckVisitor implements checkVisitorInterface {

    //Base nodes for the visitor
    checkProgram(programAST: ProgramAST) {

    }

    checkFuncDecl(funcDeclAST: FuncDeclAST) {

    }

    checkBlock(blockAST: BlockAST) {

    }

    //Stmts that need to be type checked.
    checkConditionalStmt(conditionalStmtAST: ConditionalStmtAST) {

    }

    checkAssignSmt(assignStmtAST: AssignStmtAST) {

    }

    checkWhileStmt(whileLoopStmtAST: WhileLoopStmtAST) {

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