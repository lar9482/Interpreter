import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import LocAST from "../ExprAST/LocAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import interpretElement from "../../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../../Interpret/InterpretVisitorInterface";

export default class AssignStmtAST extends StmtAST
    implements inferenceElement, 
    checkElement, 
    miscAnalyzeElement,
    interpretElement {

    location: LocAST;
    value: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        location: LocAST,
        value: ExprAST) {
        super(type, sourceLineNumber);

        this.location = location;
        this.value = value;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferAssignStmt(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkAssignSmt(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeAssignStmt(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretAssignStmtAST(this);
    }
}