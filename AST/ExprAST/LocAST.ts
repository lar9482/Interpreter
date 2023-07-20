import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";

export default class LocAST extends ExprAST {
    name: string;
    index: ExprAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        index: ExprAST | undefined) {

        super(type, sourceLineNumber);
        
        this.name = name;
        this.index = index;
    }
}