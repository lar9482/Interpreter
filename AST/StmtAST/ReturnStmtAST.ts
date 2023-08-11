import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";

export default class ReturnStmtAST extends StmtAST implements inferenceElement {

    returnValue: ExprAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        returnValue: ExprAST | undefined) {
        super(type, sourceLineNumber);

        this.returnValue = returnValue;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferReturnStmt(this);
    }
}