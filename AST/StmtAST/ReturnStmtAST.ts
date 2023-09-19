import interpretElement from "../../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../../Interpret/InterpretVisitorInterface";
import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";

export default class ReturnStmtAST extends StmtAST
    implements 
    inferenceElement, 
    checkElement, 
    miscAnalyzeElement {

    returnValue: ExprAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        returnValue: ExprAST | undefined) {
        super(type, sourceLineNumber);

        this.returnValue = returnValue;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferReturnStmt(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkReturnStmt(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeReturnStmt(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface, functionName: string) {
        visitor.interpretReturnStmtAST(this, functionName);
    }
}