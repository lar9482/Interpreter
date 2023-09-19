import { NodeType } from "../NodeType";
import { BinaryOpType } from "./ExprTypes/BinaryOpType";
import ExprAST from "./ExprAST";
import inferenceElement from "../../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import interpretElement from "../../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../../Interpret/InterpretVisitorInterface";

export default class BinaryExprAST extends ExprAST
    implements inferenceElement, 
    checkElement, 
    miscAnalyzeElement,
    interpretElement {
    operator: BinaryOpType;
    left: ExprAST;
    right: ExprAST;

    constructor(type: NodeType, sourceLineNumber: number,
        operator: BinaryOpType,
        left: ExprAST,
        right: ExprAST) {

        super(type, sourceLineNumber);

        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferBinaryExpr(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkBinaryExpr(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeBinaryExpr(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretBinaryExpr(this);
    }
}