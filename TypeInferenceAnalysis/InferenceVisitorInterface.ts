import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import LocAST from "../AST/ExprAST/LocAST";
import LiteralAST from "../AST/ExprAST/LiteralAST";

export default interface inferenceVisitorInterface {
    //Base nodes for the visitor.
    visitProgram: (programAST: ProgramAST) => void,
    visitFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    visitBlock: (blockAST: BlockAST) => void,

    //Containers for the expressions that need inference.
    visitConditionalStmt: (conditionalStmtAST: ConditionalStmtAST) => void
    visitWhileStmt: (whileStmtAST: WhileLoopStmtAST) => void
    visitAssignStmt: (assignStmtAST: AssignStmtAST) => void

    //The 'atomic' expressions that require inferences.
    visitBinaryExpr: (binaryExprAST: BinaryExprAST) => void
    visitUnaryExpr: (unaryExprAST: UnaryExprAST) => void
    visitFuncCall: (funcCallAST: FuncCallAST) => void
    visitLoc: (locASt: LocAST) => void
    visitLiteral: (literalAST: LiteralAST) => void
}