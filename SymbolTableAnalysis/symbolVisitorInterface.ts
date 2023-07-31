import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import VarDeclAST from "../AST/VarDeclAST";
import ParameterAST from "../AST/ParameterAST";

export default interface symbolVisitorInterface {
    visitProgram: (programAST: ProgramAST) => void,
    visitFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    visitBlock: (blockAST: BlockAST) => void,
    visitVarDec: (varDeclAST: VarDeclAST) => void,
    visitParameter: (parameterAST: ParameterAST) => void,
}