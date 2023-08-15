import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import AST from "../AST";
import { DecafType } from "../DecafType";
import { NodeType } from "../NodeType";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";

export default abstract class ExprAST extends AST implements inferenceElement, checkElement {
    
    decafType: DecafType;

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);

        this.decafType = DecafType.VOID
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferExpr(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkExpr(this);
    }
}