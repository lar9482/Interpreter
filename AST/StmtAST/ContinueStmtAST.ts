import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";

export default class ContinueStmtAST extends StmtAST {

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);
    }
}