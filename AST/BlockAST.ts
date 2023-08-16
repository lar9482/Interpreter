import AST from "./AST";
import { NodeType } from "./NodeType";
import VarDeclAST from "./VarDeclAST";
import StmtAST from "./StmtAST/StmtAST";

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

export default class BlockAST extends AST
    implements symbolElement, symbolScope, inferenceElement, checkElement, miscAnalyzeElement {

    variables: VarDeclAST[];
    statements: StmtAST[];
    symbols: SymbolTable;

    constructor(type: NodeType, sourceLineNumber: number,
        variables: VarDeclAST[],
        statements: StmtAST[]
    ) {
        super(type, sourceLineNumber);

        this.variables = variables;
        this.statements = statements;

        this.symbols = new SymbolTable(NodeType.BLOCK);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitBlock(this);
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferBlock(this);
    }
    
    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkBlock(this);
    }

    acceptAnalyzeElement(visitor: miscAnalysisVisitorInterface) {
        visitor.analyzeBlock(this);
    }
}