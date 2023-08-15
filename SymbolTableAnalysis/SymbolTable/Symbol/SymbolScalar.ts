import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import AST from "../../../AST/AST";

export default class SymbolScalar extends Symbol {

    scalarNode: AST;

    constructor(symbolType: SymbolType, name: string, returnType: DecafType,
        scalarNode: AST) {

        super(symbolType, name, returnType);
        this.scalarNode = scalarNode;
    }
}