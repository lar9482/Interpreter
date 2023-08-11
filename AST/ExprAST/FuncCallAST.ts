import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";

export default class FuncCallAST extends ExprAST implements inferenceElement, checkElement{
    name: string;
    funcArguments: ExprAST[];

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        funcArguments: ExprAST[]) {

        super(type, sourceLineNumber);
        
        this.name = name;
        this.funcArguments = funcArguments;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferFuncCall(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkFuncCall(this);
    }
}