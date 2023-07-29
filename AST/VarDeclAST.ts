import { NodeType } from "./NodeType";
import { DecafType } from "./DecafType";
import AST from "./AST";

import symbolElement from "../SymbolTableAnalysis/symbolElement";
import symbolVisitorInterface from "../SymbolTableAnalysis/symbolVisitorInterface";

export default class VarDeclAST extends AST implements symbolElement {
    
    public name: string;
    public decafType: DecafType;
    public isArray: boolean;
    public arrayLength: number;

    constructor(type: NodeType, sourceLineNumber: number,
                    name: string, 
                    decafType: DecafType, 
                    isArray: boolean, 
                    arrayLength: number)   {

        super(type, sourceLineNumber);

        this.name = name;
        this.decafType = decafType;
        this.isArray = isArray;
        this.arrayLength = arrayLength;
    }

    acceptSymbolElement(visitor: symbolVisitorInterface) {
        visitor.visitVarDec(this);
    }
}