import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";
import { UnaryOpType } from "./UnaryOpType";

export default class UnaryExprAST extends ExprAST {

    operator: UnaryOpType;
    child: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        operator: UnaryOpType,
        child: ExprAST) {

        super(type, sourceLineNumber);

        this.operator = operator;
        this.child = child;
    }
}