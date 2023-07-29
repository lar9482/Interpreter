import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";

import symbolElement from "../../symbolTableTraversal/symbolElement";
import symbolVisitorInterface from "../../symbolTableTraversal/symbolVisitorInterface";

export default class LocAST extends ExprAST implements symbolElement {
    name: string;
    index: ExprAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        index: ExprAST | undefined) {

        super(type, sourceLineNumber);
        
        this.name = name;
        this.index = index;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitLoc(this);
    }
}