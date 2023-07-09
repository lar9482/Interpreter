import { NodeType } from "./NodeType";
import { DecafType } from "./DecafType";
import AST from "./AST";

export default class VarDeclAST extends AST {
    
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
}