import { NodeType } from "./NodeType";
import { DecafType } from "./DecafType";
import AST from "./AST";

import ParameterAST from "./ParameterAST";
import BlockAST from "./BlockAST";

import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import symbolScope from "../SymbolTableAnalysis/SymbolASTInterface/symbolScope";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import inferenceElement from "../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../MiscStaticAnalysis/MiscAnalysisVisitorInterface";
import interpretElement from "../Interpret/InterpretASTInterface/interpretElement";
import interpretVisitorInterface from "../Interpret/InterpretVisitorInterface";

export default class FuncDeclAST
    extends AST

    implements symbolScope,
    inferenceElement,
    checkElement,
    miscAnalyzeElement,
    interpretElement {

    name: string;
    returnType: DecafType;
    parameters: ParameterAST[];
    body: BlockAST

    symbols: SymbolTable;

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        returnType: DecafType,
        parameters: ParameterAST[],
        body: BlockAST) {

        super(type, sourceLineNumber);

        this.name = name;
        this.returnType = returnType;
        this.parameters = parameters;
        this.body = body;

        this.symbols = new SymbolTable(NodeType.FUNCDECL, NodeType.PROGRAM);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }

    acceptSymbolScope(visitor: symbolVisitorInterface, containerType: NodeType) {
        visitor.visitFuncDecl(this, containerType);
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferFuncDecl(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkFuncDecl(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeFuncDecl(this);
    }

    acceptInterpretElement(visitor: interpretVisitorInterface) {
        visitor.interpretFuncDecl(this);
    }
}