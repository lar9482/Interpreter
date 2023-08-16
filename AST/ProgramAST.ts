import { NodeType } from "./NodeType";
import AST from "./AST";
import VarDeclAST from './VarDeclAST';
import FuncDeclAST from "./FuncDeclAST";

import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import symbolScope from "../SymbolTableAnalysis/SymbolASTInterface/symbolScope";

import inferenceElement from "../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../TypeCheckAnalysis/CheckVisitorInterface";
import miscAnalyzeElement from "../MiscStaticAnalysis/MiscAnalysisASTInterface/analyzeElement";
import miscAnalysisVisitorInterface from "../MiscStaticAnalysis/MiscAnalysisVisitorInterface";

export default class ProgramAST extends AST
    implements symbolScope, inferenceElement, checkElement, miscAnalyzeElement {

    public variables: VarDeclAST[];
    public functions: FuncDeclAST[];

    symbols: SymbolTable;

    constructor(type: NodeType, sourceLineNumber: number,
        variables: VarDeclAST[],
        functions: FuncDeclAST[]) {

        super(type, sourceLineNumber);

        this.variables = variables;
        this.functions = functions;
        this.symbols = new SymbolTable(NodeType.PROGRAM, NodeType.PROGRAM);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }

    acceptSymbolScope(visitor: symbolVisitorInterface, containerType: NodeType) {
        visitor.visitProgram(this, containerType);
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferProgram(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkProgram(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeProgram(this);
    }
}