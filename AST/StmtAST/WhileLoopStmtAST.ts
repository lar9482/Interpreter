import ExprAST from "../ExprAST/ExprAST";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";
import BlockAST from "../BlockAST";

import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import interpretElement from "../../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../../Interpret/InterpretVisitorInterface";

export default class WhileLoopStmtAST extends StmtAST
    implements inferenceElement, 
    checkElement, 
    miscAnalyzeElement,
    interpretElement {

    condition: ExprAST;
    body: BlockAST;

    constructor(type: NodeType, sourceLineNumber: number,
        condition: ExprAST,
        body: BlockAST) {

        super(type, sourceLineNumber);

        this.condition = condition;
        this.body = body;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferWhileStmt(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkWhileStmt(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeWhileLoopStmt(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretWhileLoopStmtAST(this);
    }
}