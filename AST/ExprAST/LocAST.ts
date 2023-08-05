import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";

export default class LocAST extends ExprAST implements inferenceElement {
    name: string;
    index: ExprAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        index: ExprAST | undefined) {

        super(type, sourceLineNumber);
        
        this.name = name;
        this.index = index;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.visitLoc(this);
    }
}