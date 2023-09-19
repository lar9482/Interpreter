import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import AST from "../../../AST/AST";

export default class SymbolScalar extends Symbol {

    scalarNode: AST;
    value: number | boolean | string;

    constructor(symbolType: SymbolType, name: string, sourceLineNumber: number, returnType: DecafType,
        scalarNode: AST) {

        super(symbolType, name, sourceLineNumber, returnType);
        this.scalarNode = scalarNode;
        this.value = this.returnType === DecafType.INT ? 0 : false
    }
}