import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";

export default class ReturnStmtAST extends StmtAST {

    returnValue: ExprAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        returnValue: ExprAST | undefined) {
        super(type, sourceLineNumber);

        this.returnValue = returnValue;
    }
}