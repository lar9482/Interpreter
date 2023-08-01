import { NodeType } from "../../AST/NodeType";
import Symbol from "./Symbol/Symbol";

export default class SymbolTable {
    table: Map<string, Symbol>;
    parentTable?: SymbolTable;
    scopeType: NodeType

    constructor(scopeType: NodeType, parentTable?: SymbolTable) {
        this.table = new Map<string, Symbol>();
        this.parentTable = parentTable;
        this.scopeType = scopeType;
    }

    addSymbol(symbol: Symbol) {
        this.table.set(symbol.name, symbol);
    }

    lookupSymbolName(symbolName: string): Symbol | undefined {
        let currentTable: SymbolTable | undefined = this;

        while (currentTable != undefined) {
            if (this.table.has(symbolName)) {
                return this.table.get(symbolName);
            }
            else {
                currentTable = this.parentTable;
            }
        }

        return undefined;
    }
}