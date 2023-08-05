import { NodeType } from "../NodeType";
import { BinaryOpType } from "./ExprTypes/BinaryOpType";
import ExprAST from "./ExprAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";

export default class BinaryExprAST extends ExprAST implements inferenceElement {
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
    
    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.visitBinaryExpr(this);
    }
}