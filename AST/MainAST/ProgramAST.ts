import { NodeType } from "./NodeType";
import AST from "./AST";

import VarDeclAST from './VarDeclAST';

export default class ProgramAST extends AST {
    
    public variables: VarDeclAST[]; 

    constructor(type: NodeType, sourceLineNumber: number,
                    variables: VarDeclAST[]) {

        super(type, sourceLineNumber);

        this.variables = variables;
    }
}