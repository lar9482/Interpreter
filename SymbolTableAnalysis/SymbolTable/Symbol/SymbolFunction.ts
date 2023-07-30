import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import ParameterAST from "../../../AST/ParameterAST";

export default class SymbolFunction extends Symbol {

    parameters: ParameterAST[]

    constructor(symbolType: SymbolType, name: string, returnType: DecafType,
        parameters: ParameterAST[]) {

        super(symbolType, name, returnType);
        this.parameters = parameters;
    }
}