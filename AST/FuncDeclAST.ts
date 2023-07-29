import { NodeType } from "./NodeType";
import { DecafType } from "./DecafType";
import AST from "./AST";

import ParameterAST from "./ParameterAST";
import BlockAST from "./BlockAST";

import symbolElement from "../SymbolTableAnalysis/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";

export default class FuncDeclAST extends AST implements symbolElement {
    name: string;
    returnType: DecafType;
    parameters: ParameterAST[];
    body: BlockAST

    constructor(type: NodeType, sourceLineNumber: number,
                name: string,
                returnType: DecafType,
                parameters: ParameterAST[],
                body: BlockAST) {

        super(type, sourceLineNumber);

        this.name = name;
        this.returnType = returnType;
        this.parameters = parameters;
        this.body = body;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitFuncDecl(this);
    }
}