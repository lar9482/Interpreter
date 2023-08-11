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

export default interface checkVisitorInterface {
    //Base nodes for the visitor
    checkProgram: (programAST: ProgramAST) => void,
    checkFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    checkBlock: (blockAST: BlockAST) => void,

    //Stmts that need to be type checked.
    checkConditionalStmt: (conditionalStmtAST: ConditionalStmtAST) => void,
    checkAssignSmt: (assignStmtAST: AssignStmtAST) => void,
    checkWhileStmt: (whileLoopStmtAST: WhileLoopStmtAST) => void,

    //Exprs that need to be type checked.
    checkBinaryExpr: (binaryExprAST: BinaryExprAST) => void,
    checkUnaryExpr: (unaryExprAST: UnaryExprAST) => void,
    checkFuncCall: (funcCallAST: FuncCallAST) => void,
    checkLoc: (locAST: LocAST) => void
}