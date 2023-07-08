import AST from "./AST";
import { DecafType } from "./DecafType";
import { NodeType } from "./NodeType";

export default class ParameterAST extends AST {

    name: string;
    parameterType: DecafType;

    constructor(type: NodeType, sourceLineNumber: number,
                name: string,
                parameterType: DecafType) {
                    
        super(type, sourceLineNumber);

        this.name = name;
        this.parameterType = parameterType;
    }

}