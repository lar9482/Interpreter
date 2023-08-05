import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import BlockAST from "../BlockAST";

import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";

export default class ConditionalStmtAST extends StmtAST implements inferenceElement {

    condition: ExprAST;
    ifBlock: BlockAST;
    elseBlock: BlockAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        condition: ExprAST,
        ifBlock: BlockAST,
        elseBlock: BlockAST | undefined) {
            
        super(type, sourceLineNumber);

        this.condition = condition;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.visitConditionalStmt(this);
    }
}