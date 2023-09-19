import { NodeType } from "../NodeType";
import { DecafType } from "../DecafType";
import ExprAST from "./ExprAST";

export default class LiteralAST extends ExprAST {

    constructor(type: NodeType, sourceLineNumber: number,
        literalType: DecafType) {

        super(type, sourceLineNumber);
        
        this.decafType = literalType;
    }
}