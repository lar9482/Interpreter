import { NodeType } from "../NodeType";
import { DecafType } from "../DecafType";
import LiteralAST from "./LiteralAST";

export default class BoolLiteralAST extends LiteralAST {

    constructor(type: NodeType, sourceLineNumber: number,
        literalType: DecafType, bool: boolean) {

        super(type, sourceLineNumber, literalType);
        this.value = bool;
    }
}