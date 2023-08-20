import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import ExprAST from "../AST/ExprAST/ExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import LocAST from "../AST/ExprAST/LocAST";

export default interface interpretVisitorInterface {
    //Base nodes for the visitor
    interpretFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    interpretBlock: (blockAST: BlockAST) => void,

    interpretReturnStmtAST: (returnStmtAST: ReturnStmtAST) => void,

    interpretExpr: (exprAST: ExprAST) => void,
    interpretBinaryExpr: (binaryExprAST: BinaryExprAST) => void
    interpretUnaryExpr: (unaryExprAST: UnaryExprAST) => void,
    interpretLoc: (locAST: LocAST) => void,
    interpretFuncCall: (funcCallAST: FuncCallAST) => void,
}