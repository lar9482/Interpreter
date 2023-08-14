import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";
import { UnaryOpType } from "./ExprTypes/UnaryOpType";

export default class UnaryExprAST extends ExprAST implements inferenceElement, checkElement {

    operator: UnaryOpType;
    child: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        operator: UnaryOpType,
        child: ExprAST) {

        super(type, sourceLineNumber);

        this.operator = operator;
        this.child = child;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferUnaryExpr(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkUnaryExpr(this);
    }
}