import AST from "../AST/MainAST/AST";
import BlockAST from "../AST/MainAST/BlockAST";
import { DecafType } from "../AST/MainAST/DecafType";
import FuncDeclAST from "../AST/MainAST/FuncDeclAST";
import { NodeType } from "../AST/MainAST/NodeType";
import ParameterAST from "../AST/MainAST/ParameterAST";
import ProgramAST from "../AST/MainAST/ProgramAST";
import VarDeclAST from "../AST/MainAST/VarDeclAST";
import Token from "../Tokens/Token"
import { TokenType } from "../Tokens/TokenType";

export default class Parser {

    tokenQueue: Token[];
    currentToken: Token;

    constructor(tokenQueue: Token[]) {
        this.tokenQueue = tokenQueue;
        this.currentToken = this.tokenQueue.shift() as Token;
    }

    parseProgram(): ProgramAST {

        const newProgramAST: ProgramAST = new ProgramAST(
            NodeType.PROGRAM,
            this.currentToken.lineCount,
            [], //initializing list to hold variables
            [] // initialising list to hold functions
        );
        
        //Program -> VarOrFunc Program
        if (this.currentToken.tokenType !== TokenType.Token_Epsilon) {
            const newAST: AST = this.parseVarOrFunc();

            if (newAST.type === NodeType.VARDECL) {
                newProgramAST.variables.push(newAST as VarDeclAST);
            }
            else if (newAST.type === NodeType.FUNCDECL) {
                const test = newAST as FuncDeclAST
                newProgramAST.functions.push(test);
            }

            const subProgramAST: ProgramAST = this.parseProgram();
            newProgramAST.variables = newProgramAST.variables.concat(subProgramAST.variables);
        }

        return newProgramAST;
    }

    private parseVarOrFunc(): AST {
        //VarOrFunc -> Var
        if (this.currentToken.tokenType === TokenType.Token_Int
            || this.currentToken.tokenType === TokenType.Token_Bool
            || this.currentToken.tokenType === TokenType.Token_Void
        ) {
            
            const newVarDeclAST: VarDeclAST = this.parseVar();

            return newVarDeclAST;
        }

        //VarOrFunc -> Func
        else if (this.currentToken.tokenType === TokenType.Token_Def) {
            
            const newFuncDeclAST: FuncDeclAST = this.parseFunc();
            return newFuncDeclAST;
        }
        
        else {
            throw new Error("parseVarOrFunc: Didn't get int, bool, void, or def tokens");
        }
    }

    private parseVar(): VarDeclAST  {
        //Var -> Type ID Var_Prime
        const decafType: DecafType = this.parseType();
        const identifier: Token = this.match(TokenType.Token_Identifier);
        const number: number = this.parseVar_Prime();

        const newVarDeclAST: VarDeclAST = new VarDeclAST(
            NodeType.VARDECL,
            identifier.lineCount,
            identifier.lexeme,
            decafType,
            number !== 0,
            number
        );

        return newVarDeclAST;
    }

    private parseType(): DecafType {
        //Type -> int
        if (this.currentToken.tokenType === TokenType.Token_Int) {
            this.match(TokenType.Token_Int);

            return DecafType.INT;
        }

        //Type -> bool
        else if (this.currentToken.tokenType === TokenType.Token_Bool) {
            this.match(TokenType.Token_Bool);

            return DecafType.BOOL;
        }

        //Type -> void
        else if (this.currentToken.tokenType === TokenType.Token_Void) {
            this.match(TokenType.Token_Void)

            return DecafType.VOID;
        }
        else {
            throw new Error("parseType: Didn't get int, bool, or void tokens");
        }
    }

    private parseVar_Prime(): number {
        //Var_Prime -> [ DEC ] ;
        if (this.currentToken.tokenType === TokenType.Token_StartBracket) {
            this.match(TokenType.Token_StartBracket);

            const decimalToken: Token = this.match(TokenType.Token_DecLiteral);

            this.match(TokenType.Token_CloseBracket);
            this.match(TokenType.Token_Semicolon);

            return parseInt(decimalToken.lexeme);
        }

        //Var_Prime -> ;
        else if (this.currentToken.tokenType === TokenType.Token_Semicolon) {
            this.match(TokenType.Token_Semicolon);

            return 0;
        }

        else {
            throw new Error("parseVar_Prime: Didn't detect [ or ; at the start");
        }
    }

    private parseFunc(): FuncDeclAST {
        //Func -> def Type ID ( ParamsOrNot ) Block
        const defToken: Token = this.match(TokenType.Token_Def);

        const functionReturnType: DecafType = this.parseType();
        const identifierToken: Token = this.match(TokenType.Token_Identifier);
        
        this.match(TokenType.Token_StartParen);

        const parameterASTList: ParameterAST[] = this.parseParamsOrNot();

        this.match(TokenType.Token_CloseParen);

        const newFuncDeclAST: FuncDeclAST = new FuncDeclAST(
            NodeType.FUNCDECL,
            defToken.lineCount,
            identifierToken.lexeme,
            functionReturnType,
            parameterASTList,

            //To implement later. (block)
            new BlockAST(NodeType.BLOCK, 0)
        );

        return newFuncDeclAST;
    }

    private parseParamsOrNot(): ParameterAST[] {
        
        //ParamsOrNot -> Params
        if (this.currentToken.tokenType === TokenType.Token_Int
            || this.currentToken.tokenType === TokenType.Token_Bool
            || this.currentToken.tokenType === TokenType.Token_Void) {
            return this.parseParams();
        }

        //Params -> ε
        else if (this.currentToken.tokenType === TokenType.Token_CloseParen) {
            return [];
        }

        else {
            throw new Error("parseParamsOrNot: Didn't detect int, bool, void, or ) at the start");
        }
    }

    private parseParams(): ParameterAST[] {
        let parameterASTList: ParameterAST[] = [];

        parameterASTList.push(
            this.parseParam()
        );

        parameterASTList = parameterASTList.concat(
            this.parseParamsTail()
        );

        return parameterASTList;
    }

    private parseParamsTail(): ParameterAST[] {
        if (this.currentToken.tokenType === TokenType.Token_Comma) {
            this.match(TokenType.Token_Comma);

            let nestedParameterASTList: ParameterAST[] = [];

            nestedParameterASTList.push(
                this.parseParam()
            );

            nestedParameterASTList = nestedParameterASTList.concat(
                this.parseParamsTail()
            );

            return nestedParameterASTList;
        }

        else if (this.currentToken.tokenType === TokenType.Token_CloseParen) {

            return [];
        }

        else {
            throw new Error("parseParamsOrNot: Didn't detect , or ) at the start");
        }
    }

    private parseParam(): ParameterAST {
        const type: DecafType = this.parseType();
        const paramIdentifier: Token = this.match(TokenType.Token_Identifier);

        const newParameterAST: ParameterAST = new ParameterAST(
            NodeType.PARAMETER,
            paramIdentifier.lineCount,
            paramIdentifier.lexeme,
            type
        )

        return newParameterAST;
    }


    private match(expectedTokenType: TokenType): Token {
        if (this.currentToken.tokenType === expectedTokenType) {
            const currentToken: Token = this.currentToken;
            this.currentToken = this.tokenQueue.shift() as Token;

            return currentToken;
        }
        else {
            throw new Error(`${expectedTokenType.toString()} expected, but found ${this.currentToken}`);
        }
    }
}