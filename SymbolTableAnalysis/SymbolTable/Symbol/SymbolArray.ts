import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import VarDeclAST from "../../../AST/VarDeclAST";

export default class SymbolArray extends Symbol {

    length: number;
    arrayNode: VarDeclAST;

    constructor(symbolType: SymbolType, name: string, returnType: DecafType,
            length: number,
            arrayNode: VarDeclAST) {
        super(symbolType, name, returnType);

        this.length = length;
        this.arrayNode = arrayNode;
    }
}