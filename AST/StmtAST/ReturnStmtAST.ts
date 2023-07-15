import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";

export default class ReturnStmtAST extends StmtAST {

    returnValue: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        returnValue: ExprAST) {
        super(type, sourceLineNumber);

        this.returnValue = returnValue;
    }
}