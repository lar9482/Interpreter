import { NodeType } from "./NodeType";

export default abstract class AST {
    public type: NodeType;
    public sourceLineNumber: number;

    constructor(type: NodeType, sourceLineNumber: number) {
        this.type = type;
        this.sourceLineNumber = sourceLineNumber;
    }
}