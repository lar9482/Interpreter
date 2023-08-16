import { NodeType } from "./NodeType";
import { DecafType } from "./DecafType";
import AST from "./AST";

import ParameterAST from "./ParameterAST";
import BlockAST from "./BlockAST";

import symbolElement from "../SymbolTableAnalysis/SymbolASTInterface/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import symbolScope from "../SymbolTableAnalysis/SymbolASTInterface/symbolScope";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import inferenceElement from "../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../MiscStaticAnalysis/MiscAnalysisVisitorInterface";

export default class FuncDeclAST extends AST
    implements symbolElement, symbolScope, inferenceElement, checkElement, miscAnalyzeElement {

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

        this.symbols = new SymbolTable(NodeType.FUNCDECL);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitFuncDecl(this);
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
}