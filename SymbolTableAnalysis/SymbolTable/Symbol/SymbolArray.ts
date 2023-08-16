import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import VarDeclAST from "../../../AST/VarDeclAST";

export default class SymbolArray extends Symbol {

    length: number;
    arrayNode: VarDeclAST;

    constructor(symbolType: SymbolType, name: string, sourceLineNumber: number, returnType: DecafType,
            length: number,
            arrayNode: VarDeclAST) {
        super(symbolType, name, sourceLineNumber, returnType);

        this.length = length;
        this.arrayNode = arrayNode;
    }
}