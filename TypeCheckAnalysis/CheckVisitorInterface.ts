import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";

export default interface checkVisitorInterface {
    //Base nodes for the visitor
    visitProgram: (programAST: ProgramAST) => void,
    visitFuncDecl: (funcDeclAST: FuncDeclAST) => void,
    visitBlock: (blockAST: BlockAST) => void,

    //Stmts that need to be type checked.
    visitConditionalStmt: () => void,
    visitAssignSmt: () => void,
    visitWhileStmt: () => void,
    visitVoidFuncCall: () => void
}