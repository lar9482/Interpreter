import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import BlockAST from "../BlockAST";

import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";

export default class WhileLoopStmtAST extends StmtAST implements inferenceElement {

    condition: ExprAST;
    body: BlockAST;

    constructor(type: NodeType, sourceLineNumber: number,
        condition: ExprAST,
        body: BlockAST) {
            
        super(type, sourceLineNumber);

        this.condition = condition;
        this.body = body;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferWhileStmt(this);
    }
}