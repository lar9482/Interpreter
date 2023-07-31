import SymbolTable from "./SymbolTable/SymbolTable";

//Interface for AST nodes that will have their own scope.
export default interface symbolScope {
    symbols: SymbolTable;
    addSymbolTable: (symbolTable: SymbolTable) => void
}