import { NodeType } from "../NodeType";
import { DecafType } from "../DecafType";
import ExprAST from "./ExprAST";

export default class LiteralAST extends ExprAST {
    literalType: DecafType;

    constructor(type: NodeType, sourceLineNumber: number,
        literalType: DecafType) {

        super(type, sourceLineNumber);
        
        this.literalType = literalType;
        
    }
}