import { NodeType } from "../NodeType";
import { DecafType } from "../DecafType";
import LiteralAST from "./LiteralAST";

export default class IntLiteralAST extends LiteralAST {
    int: number;

    constructor(type: NodeType, sourceLineNumber: number,
        literalType: DecafType, int: number) {

        super(type, sourceLineNumber, literalType);
        this.int = int;
    }
}