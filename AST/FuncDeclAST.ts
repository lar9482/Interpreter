import { NodeType } from "./NodeType";
import { DecafType } from "./DecafType";
import AST from "./AST";

import ParameterAST from "./ParameterAST";
import BlockAST from "./BlockAST";

import symbolElement from "../SymbolTableAnalysis/SymbolASTInterface/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";
import symbolScope from "../SymbolTableAnalysis/SymbolASTInterface/symbolScope";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";

export default class FuncDeclAST extends AST implements symbolElement, symbolScope {
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

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitFuncDecl(this);
    }

    addSymbolTable(symbolTable: SymbolTable) {
        this.symbols = symbolTable;
    }
}