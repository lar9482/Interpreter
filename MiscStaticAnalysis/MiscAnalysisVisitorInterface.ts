import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import BreakStmtAST from "../AST/StmtAST/BreakStmtAST";
import ContinueStmtAST from "../AST/StmtAST/ContinueStmtAST";

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
}