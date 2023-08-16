import { NodeType } from "../../AST/NodeType";
import SymbolTable from "../SymbolTable/SymbolTable";
import symbolVisitorInterface from "../symbolVisitorInterface";

//Interface for AST nodes that will have their own scope.
export default interface symbolScope {
    symbols: SymbolTable;
    addSymbolTable: (symbolTable: SymbolTable) => void
    acceptSymbolScope: (visitor: symbolVisitorInterface, parentScopeType: NodeType) => void
}