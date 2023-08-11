import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import AST from "../AST";
import { DecafType } from "../DecafType";
import { NodeType } from "../NodeType";

export default class ExprAST extends AST implements inferenceElement {
    
    decafType: DecafType;

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);

        this.decafType = DecafType.VOID
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferExpr(this);
    }
}