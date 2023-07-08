import AST from "../AST/MainAST/AST";
import { DecafType } from "../AST/MainAST/DecafType";
import { NodeType } from "../AST/MainAST/NodeType";
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
            []
        );

        if (this.currentToken.tokenType !== TokenType.Token_Epsilon) {
            const newAST: AST = this.parseVarOrFunc();

            if (newAST.type === NodeType.VARDECL) {
                newProgramAST.variables.push(newAST as VarDeclAST);
            }
            else if (newAST.type === NodeType.FUNCDECL) {
                //Implement this later
            }

            const subProgramAST: ProgramAST = this.parseProgram();
            newProgramAST.variables = newProgramAST.variables.concat(subProgramAST.variables);
        }

        return newProgramAST;
    }

    private parseVarOrFunc(): AST {
        if (this.currentToken.tokenType === TokenType.Token_Int
            || this.currentToken.tokenType === TokenType.Token_Bool
            || this.currentToken.tokenType === TokenType.Token_Void
        ) {
            
            const newVarDeclAST: VarDeclAST = this.parseVar();

            return newVarDeclAST;
        }

        else if (this.currentToken.tokenType === TokenType.Token_Def) {
            //Implement this later.

            return new AST(NodeType.FUNCDECL, 1);
        }
        
        else {
            throw new Error("parseVarOrFunc: Didn't get int, bool, void, or def tokens");
        }
    }

    private parseVar(): VarDeclAST  {
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
        if (this.currentToken.tokenType === TokenType.Token_Int) {
            this.match(TokenType.Token_Int);

            return DecafType.INT;
        }
        else if (this.currentToken.tokenType === TokenType.Token_Bool) {
            this.match(TokenType.Token_Bool);

            return DecafType.BOOL;
        }
        else if (this.currentToken.tokenType === TokenType.Token_Void) {
            this.match(TokenType.Token_Void)

            return DecafType.VOID;
        }
        else {
            throw new Error("parseType: Didn't get int, bool, or void tokens");
        }
    }

    private parseVar_Prime(): number {
        if (this.currentToken.tokenType === TokenType.Token_StartBracket) {
            this.match(TokenType.Token_StartBracket);

            const decimalToken: Token = this.match(TokenType.Token_DecLiteral);

            this.match(TokenType.Token_CloseBracket);
            this.match(TokenType.Token_Semicolon);

            return parseInt(decimalToken.lexeme);
        }
        else if (this.currentToken.tokenType === TokenType.Token_Semicolon) {
            this.match(TokenType.Token_Semicolon);

            return 0;
        }

        else {
            throw new Error("parseVar_Prime: Didn't detect [ or ; at the start");
        }
    }

    private parseFunc() {
        this.match(TokenType.Token_Def);

        const functionReturnType: DecafType = this.parseType();
        const identifierToken: Token = this.match(TokenType.Token_Identifier);
        
        this.match(TokenType.Token_StartParen);
    }

    private parseParamsOrNot() {

    }

    private parseParams() {

    }

    private parseParamsTail() {

    }

    private parseParam() {
        
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