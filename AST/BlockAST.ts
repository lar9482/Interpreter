import AST from "./AST";
import { NodeType } from "./NodeType";
import VarDeclAST from "./VarDeclAST";
import StmtAST from "./StmtAST";

export default class BlockAST extends AST {

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
}