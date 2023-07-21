// PREDICT:
// parseLocOrFunc ->  Id LocOrFuncDetails : Id
// LocOrFuncDetails ->  IndexOrNot : ) [ ; = BINOP
// LocOrFuncDetails ->  ( ArgsOrNot ) : (
// IndexOrNot ->  [ Expr ] : [
// IndexOrNot ->  ) : )
// IndexOrNot ->  ; : ;
// IndexOrNot ->  = : =
// IndexOrNot ->  BINOP : BINOP
// ArgsOrNot ->  Args : Expr
// ArgsOrNot -> epsilon : )
// Args ->  Expr ArgsTail : Expr
// ArgsTail ->  , Expr ArgsTail : ,
// ArgsTail -> epsilon : )

import ExprAST from "../AST/ExprAST/ExprAST";
import LocAST from "../AST/ExprAST/LocAST";
import { NodeType } from "../AST/NodeType";
import Token from "../Tokens/Token";
import { TokenType } from "../Tokens/TokenType";
import ExprParser from "./ExprParser";
import consume from "./consume";

export default class LocOrFuncCallParser {
    static parseLocOrFunc(currToken: Token, currTokenQueue: Token[]): ExprAST {

        //LocOrFunc -> ID parseLocOrFuncDetails
        const identifierToken: Token = consume(TokenType.Token_Identifier, currToken, currTokenQueue);

        const locOrFuncCallAST: ExprAST = this.parseLocOrFuncDetails(currToken, currTokenQueue, identifierToken);
        
        return locOrFuncCallAST;
    }

    private static parseLocOrFuncDetails(currToken: Token, currTokenQueue: Token[], identifierToken: Token) {
        //LocOrFuncDetails -> ( ArgsOrNot )
        if (currToken.tokenType === TokenType.Token_StartParen) {

            return new ExprAST(NodeType.LOCATION, 0);
        }

        //LocOrFuncDetails -> IndexOrNot
        else {
            const indexExprOrNot: ExprAST | undefined = this.parseIndexOrNot(currToken, currTokenQueue, identifierToken);

            const newLocAST: LocAST = new LocAST(
                NodeType.LOCATION,
                identifierToken.lineCount,
                identifierToken.lexeme, 
                indexExprOrNot
            );

            return newLocAST;
        }
    }

    private static parseIndexOrNot(currToken: Token, currTokenQueue: Token[], identifierToken: Token): ExprAST | undefined {
        //IndexOrNot -> [ Expr ]
        if (currToken.tokenType === TokenType.Token_StartBracket) {
            consume(TokenType.Token_StartBracket, currToken, currTokenQueue);

            const exprParser: ExprParser = new ExprParser(currToken, currTokenQueue);

            const indexExprAST: ExprAST = exprParser.parseExpr();

            consume(TokenType.Token_CloseBracket, currToken, currTokenQueue);

            return indexExprAST;
        }

        //IndexOrNot -> ε
        else if (currToken.tokenType === TokenType.Token_CloseParen || 
            currToken.tokenType === TokenType.Token_Semicolon ||
            currToken.tokenType === TokenType.Token_Assign ||
            this.isBinaryExprOperator(currToken)) {
            
            return undefined;
        }

        else {
            throw new Error(`parseIndexOrNot: Expected [, ), ;, =, or a binary operator but got ${currToken.lexeme}`)
        }
    }

    private static isBinaryExprOperator(currentToken: Token) {
        return (
            currentToken.tokenType === TokenType.Token_Multiply ||
            currentToken.tokenType === TokenType.Token_Divide ||
            currentToken.tokenType === TokenType.Token_Modus ||
            currentToken.tokenType === TokenType.Token_Plus ||
            currentToken.tokenType === TokenType.Token_Subtraction ||
            currentToken.tokenType === TokenType.Token_LessThan ||
            currentToken.tokenType === TokenType.Token_LessThanEqual ||
            currentToken.tokenType === TokenType.Token_MoreThanEqual ||
            currentToken.tokenType === TokenType.Token_MoreThan ||
            currentToken.tokenType === TokenType.Token_Equal ||
            currentToken.tokenType === TokenType.Token_NotEqual ||
            currentToken.tokenType === TokenType.Token_And ||
            currentToken.tokenType === TokenType.Token_Or
        );
    }
}