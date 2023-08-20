import { NodeType } from "../../AST/NodeType";
import Symbol from "./Symbol/Symbol";

/**
 * containerType and parentTable aren't necessarily related
 * 
 * For example, if the current symbol table is at a block level,
 * then the parent table is pointing to the scope of another nested block or a function declaration.
 * 
 * However, containerType refers to the node immediately above the node that points to the current symbol table.
 */
export default class SymbolTable {
    table: Map<string, Symbol>;

    scopeType: NodeType;
    containerType: NodeType;

    parentTable?: SymbolTable;
    scopeName?: string

    constructor(scopeType: NodeType, containerType: NodeType, parentTable?: SymbolTable, scopeName?: string) {
        this.table = new Map<string, Symbol>();

        this.scopeType = scopeType;
        this.containerType = containerType;

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

    isDescendantOf(containerType: NodeType): boolean {
        let currentTable: SymbolTable | undefined = this;

        while (currentTable != undefined) {
            if (currentTable.containerType === containerType) {
                return true;
            }
            else {
                currentTable = currentTable.parentTable;
            }
        }

        return false;
    }

    synchronizeRootTable(updatedTable: SymbolTable) {
        let currTable: SymbolTable = this;
        let currUpdatedTable: SymbolTable = updatedTable;

        while (currTable.parentTable !== undefined) {
            currTable = currTable.parentTable;
        }

        while (currUpdatedTable.parentTable !== undefined) {
            currUpdatedTable = currUpdatedTable.parentTable;
        }

        if (currTable.scopeType === currUpdatedTable.scopeType
            && currTable.containerType === currUpdatedTable.containerType
            && Array.from(currTable.table.keys())
               .every(symbolName =>
                      Array.from(currUpdatedTable.table.keys())
                      .includes(symbolName))
        ) {
            const symbolNames: string[] = Array.from(currTable.table.keys());
            symbolNames.forEach((symbolName: string) => {
                const currSymbol: Symbol = currTable.table.get(symbolName) as Symbol;
                const currUpdatedSymbol: Symbol = currUpdatedTable.table.get(symbolName) as Symbol;

                currSymbol.value = currUpdatedSymbol.value;
            })
        } else {
            throw new Error(
                'Unable to synchronize root tables. Either the scope type, container type, or symbol names do not match'
            )
        }
    }


}