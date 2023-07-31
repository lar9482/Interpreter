import { NodeType } from "./NodeType";
import AST from "./AST";
import VarDeclAST from './VarDeclAST';
import FuncDeclAST from "./FuncDeclAST";

import symbolElement from "../SymbolTableAnalysis/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import symbolScope from "../SymbolTableAnalysis/symbolScope";

export default class ProgramAST extends AST implements symbolElement, symbolScope {
    
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
}