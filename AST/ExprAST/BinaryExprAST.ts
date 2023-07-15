import { NodeType } from "../NodeType";
import { BinaryOpType } from "./BinaryOpType";
import ExprAST from "./ExprAST";

export default class BinaryExprAST extends ExprAST {
    operator: BinaryOpType;
    left: ExprAST;
    right: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        operator: BinaryOpType,
        left: ExprAST,
        right: ExprAST) {

        super(type, sourceLineNumber);

        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}