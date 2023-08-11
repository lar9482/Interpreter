import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";

export default class LocAST extends ExprAST implements inferenceElement, checkElement {
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
        visitor.inferLoc(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkLoc(this);
    }
}