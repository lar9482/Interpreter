import { NodeType } from "../NodeType";
import ExprAST from "./ExprAST";

export default class FuncCallAST extends ExprAST {
    name: string;
    funcArguments: ExprAST[];

    constructor(type: NodeType, sourceLineNumber: number,
        name: string,
        funcArguments: ExprAST[]) {

        super(type, sourceLineNumber);
        
        this.name = name;
        this.funcArguments = funcArguments;
    }
}