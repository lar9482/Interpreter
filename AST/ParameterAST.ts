import AST from "./AST";
import { DecafType } from "./DecafType";
import { NodeType } from "./NodeType";

import symbolElement from "../SymbolTableAnalysis/SymbolASTInterface/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";

export default class ParameterAST extends AST implements symbolElement {

    name: string;
    parameterType: DecafType;

    constructor(type: NodeType, sourceLineNumber: number,
                name: string,
                parameterType: DecafType) {
                    
        super(type, sourceLineNumber);

        this.name = name;
        this.parameterType = parameterType;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitParameter(this);
    }
}