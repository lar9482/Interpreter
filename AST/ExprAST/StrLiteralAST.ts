import { NodeType } from "../NodeType";
import { DecafType } from "../DecafType";
import LiteralAST from "./LiteralAST";

export default class StrLiteralAST extends LiteralAST {
    str: string;

    constructor(type: NodeType, sourceLineNumber: number,
        literalType: DecafType, str: string) {

        super(type, sourceLineNumber, literalType);
        this.str = str;
    }
}