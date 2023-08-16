import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import ParameterAST from "../../../AST/ParameterAST";
import FuncDeclAST from "../../../AST/FuncDeclAST";

export default class SymbolFunction extends Symbol {

    parameters: ParameterAST[]
    funcDeclNode?: FuncDeclAST;

    constructor(symbolType: SymbolType, name: string, sourceLineNumber: number, returnType: DecafType,
        parameters: ParameterAST[],
        funcDeclNode?: FuncDeclAST) {

        super(symbolType, name, sourceLineNumber, returnType);
        this.parameters = parameters;
        this.funcDeclNode = funcDeclNode;
    }
}