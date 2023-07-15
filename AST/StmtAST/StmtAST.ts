import AST from "../AST";
import { NodeType } from "../NodeType";

export default class StmtAST extends AST {

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);
    }
}