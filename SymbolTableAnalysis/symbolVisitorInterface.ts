import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import VarDeclAST from "../AST/VarDeclAST";
import ParameterAST from "../AST/ParameterAST";
import { NodeType } from "../AST/NodeType";

export default interface symbolVisitorInterface {
    visitProgram: (programAST: ProgramAST, containerType: NodeType) => void,
    visitFuncDecl: (funcDeclAST: FuncDeclAST, containerType: NodeType) => void,
    visitBlock: (blockAST: BlockAST, containerType: NodeType) => void,

    visitVarDec: (varDeclAST: VarDeclAST) => void,
    visitParameter: (parameterAST: ParameterAST) => void,
}