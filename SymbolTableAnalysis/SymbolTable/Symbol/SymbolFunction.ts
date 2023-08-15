import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import ParameterAST from "../../../AST/ParameterAST";
import FuncDeclAST from "../../../AST/FuncDeclAST";

export default class SymbolFunction extends Symbol {

    parameters: ParameterAST[]
    functionDeclaration?: FuncDeclAST;

    constructor(symbolType: SymbolType, name: string, returnType: DecafType,
        parameters: ParameterAST[],
        functionDeclaration?: FuncDeclAST) {

        super(symbolType, name, returnType);
        this.parameters = parameters;
        this.functionDeclaration = functionDeclaration;
    }
}