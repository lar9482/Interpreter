import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import LocAST from "../ExprAST/LocAST";

export default class AssignStmtAST extends StmtAST {

    location: LocAST;
    value: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        location: LocAST,
        value: ExprAST) {
        super(type, sourceLineNumber);

        this.location = location;
        this.value = value;
    }
}