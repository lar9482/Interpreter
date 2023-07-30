import Symbol from "./Symbol/Symbol";

export default class SymbolTable {
    symbols: Symbol[];
    parentTable: SymbolTable;

    constructor(symbols: Symbol[], parentTable: SymbolTable) {
        this.symbols = symbols;
        this.parentTable = parentTable;
    }

    
}