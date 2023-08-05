import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import LocAST from "../ExprAST/LocAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";

export default class AssignStmtAST extends StmtAST implements inferenceElement {

    location: LocAST;
    value: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        location: LocAST,
        value: ExprAST) {
        super(type, sourceLineNumber);

        this.location = location;
        this.value = value;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.visitAssignStmt(this);
    }
}