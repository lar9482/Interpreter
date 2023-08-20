import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import AST from "../AST";
import { DecafType } from "../DecafType";
import { NodeType } from "../NodeType";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import interpretElement from "../../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../../Interpret/InterpretVisitorInterface";

export default abstract class ExprAST extends AST
    implements inferenceElement, 
    checkElement, 
    miscAnalyzeElement,
    interpretElement {

    decafType: DecafType;
    value: number | boolean | string;

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);

        this.decafType = DecafType.VOID;
        this.value = 0;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferExpr(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkExpr(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeExpr(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretExpr(this);
    }
}