import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import { NodeType } from "../NodeType";
import StmtAST from "./StmtAST";

export default class ContinueStmtAST extends StmtAST implements miscAnalyzeElement {

    constructor(type: NodeType, sourceLineNumber: number) {
        super(type, sourceLineNumber);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeContinueStmt(this);
    }
}