import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";

export default class SymbolArray extends Symbol {

    length: number;

    constructor(symbolType: SymbolType, name: string, returnType: DecafType,
            length: number) {
        super(symbolType, name, returnType);

        this.length = length;
    }
}