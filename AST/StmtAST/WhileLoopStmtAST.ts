import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import BlockAST from "../BlockAST";

export default class WhileLoopStmtAST extends StmtAST {

    condition: ExprAST;
    body: BlockAST;

    constructor(type: NodeType, sourceLineNumber: number,
        condition: ExprAST,
        body: BlockAST) {
            
        super(type, sourceLineNumber);

        this.condition = condition;
        this.body = body;
    }
}