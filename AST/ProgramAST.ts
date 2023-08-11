import { NodeType } from "./NodeType";
import AST from "./AST";
import VarDeclAST from './VarDeclAST';
import FuncDeclAST from "./FuncDeclAST";

import symbolElement from "../SymbolTableAnalysis/SymbolASTInterface/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import symbolScope from "../SymbolTableAnalysis/SymbolASTInterface/symbolScope";

import inferenceElement from "../TypeInferenceAnalysis/TypeInferenceASTInterface/inferenceElement";
import inferenceVisitorInterface from "../TypeInferenceAnalysis/InferenceVisitorInterface";
import checkElement from "../TypeCheckAnalysis/TypeCheckASTInterface/checkElement";
import checkVisitorInterface from "../TypeCheckAnalysis/CheckVisitorInterface";

export default class ProgramAST extends AST
    implements symbolElement, symbolScope, inferenceElement, checkElement {

    public variables: VarDeclAST[];
    public functions: FuncDeclAST[];

    symbols: SymbolTable;

    constructor(type: NodeType, sourceLineNumber: number,
        variables: VarDeclAST[],
        functions: FuncDeclAST[]) {

        super(type, sourceLineNumber);

        this.variables = variables;
        this.functions = functions;
        this.symbols = new SymbolTable(NodeType.PROGRAM);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitProgram(this);
    }

    acceptInferenceElement(visitor: inferenceVisitorInterface) {
        visitor.inferProgram(this);
    }

    acceptCheckElement(visitor: checkVisitorInterface) {
        visitor.checkProgram(this);
    }
}