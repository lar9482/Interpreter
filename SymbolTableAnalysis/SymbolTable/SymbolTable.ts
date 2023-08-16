import { NodeType } from "../../AST/NodeType";
import Symbol from "./Symbol/Symbol";

export default class SymbolTable {
    table: Map<string, Symbol>;
    parentTable?: SymbolTable;
    scopeType: NodeType;
    scopeName?: string

    constructor(scopeType: NodeType, parentTable?: SymbolTable, scopeName?: string) {
        this.table = new Map<string, Symbol>();
        this.scopeType = scopeType;
        this.parentTable = parentTable;
        this.scopeName = scopeName;
    }

    addSymbol(symbol: Symbol) {
        this.table.set(symbol.name, symbol);
    }

    lookupSymbolName(symbolName: string): Symbol | undefined {
        let currentTable: SymbolTable | undefined = this;

        while (currentTable != undefined) {
            if ((currentTable as SymbolTable).table.has(symbolName)) {
                return (currentTable as SymbolTable).table.get(symbolName);
            }
            else {
                currentTable = currentTable.parentTable;
            }
        }

        return undefined;
    }
}