import { NodeType } from "./NodeType";
import AST from "./AST";
import VarDeclAST from './VarDeclAST';
import FuncDeclAST from "./FuncDeclAST";

import symbolElement from "../symbolTableTraversal/symbolElement";
import symbolVisitorInterface from "../symbolTableTraversal/symbolVisitorInterface";

export default class ProgramAST extends AST implements symbolElement {
    
    public variables: VarDeclAST[]; 
    public functions: FuncDeclAST[];

    constructor(type: NodeType, sourceLineNumber: number,
                    variables: VarDeclAST[],
                    functions: FuncDeclAST[]) {

        super(type, sourceLineNumber);

        this.variables = variables;
        this.functions = functions;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitProgram(this);
    }
}