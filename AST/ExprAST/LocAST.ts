import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import interpretElement from "../../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../../Interpret/InterpretVisitorInterface";

export default class LocAST extends ExprAST
    implements inferenceElement, 
    checkElement, 
    miscAnalyzeElement,
    interpretElement {

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

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeLoc(this);
    }
    
    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretLoc(this);
    }
    
}