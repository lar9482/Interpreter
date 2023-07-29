import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import LocAST from "../AST/ExprAST/LocAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import VarDeclAST from "../AST/VarDeclAST";
import ParameterAST from "../AST/ParameterAST";
import ExprAST from "../AST/ExprAST/ExprAST";

export default interface symbolVisitorInterface {
    //symbolContext visitors
    visitProgram: (programAST: ProgramAST) => void,
    visitFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    visitBlock: (blockAST: BlockAST) => void,

    //symbolElement visitors
    visitVarDec: (varDeclAST: VarDeclAST) => void,
    visitParameter: (parameterAST: ParameterAST) => void,
    visitLoc: (locAST: LocAST) => void,
    visitFuncCall: (funcCallAST: FuncCallAST) => void
}