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
import ExprAST from "../AST/ExprAST/ExprAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";

export default interface inferenceVisitorInterface {
    //Base nodes for the visitor.
    inferProgram: (programAST: ProgramAST) => void,
    inferFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    inferBlock: (blockAST: BlockAST) => void,

    //Containers for the expressions that need inference.
    inferConditionalStmt: (conditionalStmtAST: ConditionalStmtAST) => void
    inferWhileStmt: (whileStmtAST: WhileLoopStmtAST) => void
    inferAssignStmt: (assignStmtAST: AssignStmtAST) => void
    inferReturnStmt: (returnStmtAST: ReturnStmtAST) => void
    inferExpr: (exprAST: ExprAST) => void

    //The 'atomic' expressions that require inferences.
    inferBinaryExpr: (binaryExprAST: BinaryExprAST) => void
    inferUnaryExpr: (unaryExprAST: UnaryExprAST) => void
    inferFuncCall: (funcCallAST: FuncCallAST) => void
    inferLoc: (locASt: LocAST) => void
}