import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";

import symbolElement from "../../symbolTableTraversal/symbolElement";
import symbolVisitorInterface from "../../symbolTableTraversal/symbolVisitorInterface";

export default class FuncCallAST extends ExprAST implements symbolElement {
    name: string;
    funcArguments: ExprAST[];

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        funcArguments: ExprAST[]) {

        super(type, sourceLineNumber);
        
        this.name = name;
        this.funcArguments = funcArguments;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitFuncCall(this);
    }
}