import AST from "./AST";
import { NodeType } from "./NodeType";
import VarDeclAST from "./VarDeclAST";
import StmtAST from "./StmtAST/StmtAST";

import symbolElement from "../SymbolTableAnalysis/SymbolASTInterface/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import symbolScope from "../SymbolTableAnalysis/SymbolASTInterface/symbolScope";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import inferenceElement from "../TypeInferenceAnalysis/TypeInferenceASTInference/inferenceElement";
import inferenceVisitorInterface from "../TypeInferenceAnalysis/InferenceVisitorInterface";

export default class BlockAST extends AST implements symbolElement, symbolScope, inferenceElement {

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

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitBlock(this);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.visitBlock(this);
    }
}