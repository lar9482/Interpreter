import Symbol from "./Symbol";
import { SymbolType } from "./SymbolType";
import { DecafType } from "../../../AST/DecafType";
import ParameterAST from "../../../AST/ParameterAST";
import FuncDeclAST from "../../../AST/FuncDeclAST";

export default class SymbolFunction extends Symbol {

    parameters: ParameterAST[];
    funcDeclNode?: FuncDeclAST;

    value: number | boolean | void;

    constructor(symbolType: SymbolType, name: string, sourceLineNumber: number, returnType: DecafType,
        parameters: ParameterAST[],
        funcDeclNode?: FuncDeclAST) {

        super(symbolType, name, sourceLineNumber, returnType);
        this.parameters = parameters;
        this.funcDeclNode = funcDeclNode;

        if (returnType === DecafType.VOID) {
            this.value = undefined;
        } else if (returnType === DecafType.INT) {
            this.value = 0;
        } else if (returnType === DecafType.BOOL) {
            this.value = false;
        }
    }
}