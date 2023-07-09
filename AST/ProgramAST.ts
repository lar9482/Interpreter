import { NodeType } from "./NodeType";
import AST from "./AST";

import VarDeclAST from './VarDeclAST';
import FuncDeclAST from "./FuncDeclAST";

export default class ProgramAST extends AST {
    
    public variables: VarDeclAST[]; 
    public functions: FuncDeclAST[];

    constructor(type: NodeType, sourceLineNumber: number,
                    variables: VarDeclAST[],
                    functions: FuncDeclAST[]) {

        super(type, sourceLineNumber);

        this.variables = variables;
        this.functions = functions;
    }
}