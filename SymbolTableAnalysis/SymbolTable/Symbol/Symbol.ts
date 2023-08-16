import { DecafType } from "../../../AST/DecafType";
import { SymbolType } from "./SymbolType"

export default abstract class Symbol {

    symbolType: SymbolType;
    name: string;
    sourceLineNumber: number;
    returnType: DecafType;

    constructor(symbolType: SymbolType, name: string, sourceLineNumber: number, returnType: DecafType) {
        this.symbolType = symbolType;
        this.name = name;
        this.sourceLineNumber = sourceLineNumber;
        this.returnType = returnType;
    }
}