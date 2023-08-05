import AST from "../AST";
import { DecafType } from "../DecafType";
import { NodeType } from "../NodeType";

export default class ExprAST extends AST {
    
    decafType: DecafType;

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);

        this.decafType = DecafType.VOID
    }
}