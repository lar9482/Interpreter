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

export default class ConditionalStmtAST extends StmtAST
    implements inferenceElement, 
    checkElement, 
    miscAnalyzeElement,
    interpretElement {

    condition: ExprAST;
    ifBlock: BlockAST;
    elseBlock: BlockAST | undefined;

    constructor(type: NodeType, sourceLineNumber: number,
        condition: ExprAST,
        ifBlock: BlockAST,
        elseBlock: BlockAST | undefined) {

        super(type, sourceLineNumber);

        this.condition = condition;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferConditionalStmt(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkConditionalStmt(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeConditionalStmt(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretConditionalStmtAST(this);
    }
}