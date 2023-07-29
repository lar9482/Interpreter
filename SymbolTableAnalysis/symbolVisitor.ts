import symbolVisitorInterface from "./symbolVisitorInterface";
import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";

import VarDeclAST from "../AST/VarDeclAST";
import ParameterAST from "../AST/ParameterAST";
import LocAST from "../AST/ExprAST/LocAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import ExprAST from "../AST/ExprAST/ExprAST";

export default class SymbolVisitor implements symbolVisitorInterface {
    visitProgram (programAST: ProgramAST) { 

    }

    visitFuncDecl (funcDeclAST: FuncDeclAST) {

    }

    visitBlock(blockAST: BlockAST) {

    }

    visitVarDec (varDeclAST: VarDeclAST) {

    }

    visitParameter (parameterAST: ParameterAST) {
        
    }

    visitLoc (locAST: LocAST) {
        
    }

    visitFuncCall (funcCallAST: FuncCallAST) {
        
    }
}