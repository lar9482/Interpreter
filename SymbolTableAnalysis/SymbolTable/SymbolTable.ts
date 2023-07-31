import { NodeType } from "../../AST/NodeType";
import Symbol from "./Symbol/Symbol";

export default class SymbolTable {
    symbols: Map<string, Symbol>;
    parentTable?: SymbolTable;
    scopeType: NodeType

    constructor(scopeType: NodeType, parentTable?: SymbolTable) {
        this.symbols = new Map<string, Symbol>();
        this.parentTable = parentTable;
        this.scopeType = scopeType;
    }

    addSymbol(symbol: Symbol) {
        this.symbols.set(symbol.name, symbol);
    }

    lookupSymbolName(symbolName: string): Symbol | undefined {
        let currentTable: SymbolTable | undefined = this;

        while (currentTable != undefined) {
            if (this.symbols.has(symbolName)) {
                return this.symbols.get(symbolName);
            }
            else {
                currentTable = this.parentTable;
            }
        }

        return undefined;
    }
}