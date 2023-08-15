import { DecafType } from "../../../AST/DecafType";
import { SymbolType } from "./SymbolType"

export default abstract class Symbol {

    symbolType: SymbolType;
    name: string;
    returnType: DecafType

    constructor(symbolType: SymbolType, name: string, returnType: DecafType) {
        this.symbolType = symbolType;
        this.name = name;
        this.returnType = returnType;
    }
}