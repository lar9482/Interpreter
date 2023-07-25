import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import LocAST from "../AST/ExprAST/LocAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import VarDeclAST from "../AST/VarDeclAST";

export default interface symbolVisitorInterface {
    visitProgram: (programAST: ProgramAST) => void,
    visitVarDec: (varDeclAST: VarDeclAST) => void,
    visitFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    visitBlock: (blockAST: BlockAST) => void,
    visitLoc: (locAST: LocAST) => void,
    visitFuncCall: (funcCallAST: FuncCallAST) => void
}