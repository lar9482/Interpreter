import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import BreakStmtAST from "../AST/StmtAST/BreakStmtAST";
import ContinueStmtAST from "../AST/StmtAST/ContinueStmtAST";
import ExprAST from "../AST/ExprAST/ExprAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import LocAST from "../AST/ExprAST/LocAST";

export default interface miscAnalysisVisitorInterface {
    //Base nodes for the visitor.
    analyzeProgram: (programAST: ProgramAST) => void,
    analyzeFuncDecl: (funcDeclAST: FuncDeclAST) => void
    analyzeBlock: (blockAST: BlockAST) => void,

    //Statements to analyze(either because they have their blocks or locations)
    analyzeAssignStmt: (assignStmtAST: AssignStmtAST) => void,
    analyzeWhileLoopStmt: (whileLoopStmtAST: WhileLoopStmtAST) => void,
    analyzeConditionalStmt: (conditionalStmtAST: ConditionalStmtAST) => void,
    analyzeReturnStmt: (returnStmtAST: ReturnStmtAST) => void,
    analyzeBreakStmt: (breakStmtAST: BreakStmtAST) => void,
    analyzeContinueStmt: (continueStmtAST: ContinueStmtAST) => void,

    //Expressions to analyze(because they contain locations).
    analyzeExpr: (exprAST: ExprAST) => void,
    analyzeBinaryExpr: (binaryExprAST: BinaryExprAST) => void,
    analyzeUnaryExpr: (unaryExprAST: UnaryExprAST) => void,
    analyzeFuncCall: (funcCallAST: FuncCallAST) => void,
    analyzeLoc: (locAST: LocAST) => void
}