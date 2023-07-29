import AST from "./AST";
import { NodeType } from "./NodeType";
import VarDeclAST from "./VarDeclAST";
import StmtAST from "./StmtAST/StmtAST";

import symbolElement from "../symbolTableTraversal/symbolElement";
import symbolVisitorInterface from "../symbolTableTraversal/symbolVisitorInterface";

export default class BlockAST extends AST implements symbolElement {

    variables: VarDeclAST[];
    statements: StmtAST[];

    constructor(type: NodeType, sourceLineNumber: number,
                variables: VarDeclAST[],
                statements: StmtAST[]
    ) {
        super(type, sourceLineNumber);

        this.variables = variables;
        this.statements = statements;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitBlock(this);
    }
}