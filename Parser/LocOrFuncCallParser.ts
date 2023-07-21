import ExprAST from "../AST/ExprAST/ExprAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
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
            consume(TokenType.Token_StartParen, currToken, currTokenQueue);

            const argumentASTs: ExprAST[] = this.parseArgsOrNot(currToken, currTokenQueue);

            consume(TokenType.Token_CloseParen, currToken, currTokenQueue);
            
            const newFuncCallAST: FuncCallAST = new FuncCallAST(
                NodeType.FUNCCALL,
                identifierToken.lineCount,
                identifierToken.lexeme,
                argumentASTs
            );

            return newFuncCallAST;
        }

        //LocOrFuncDetails -> IndexOrNot
        else {
            const indexExprOrNot: ExprAST | undefined = this.parseIndexOrNot(currToken, currTokenQueue);

            const newLocAST: LocAST = new LocAST(
                NodeType.LOCATION,
                identifierToken.lineCount,
                identifierToken.lexeme, 
                indexExprOrNot
            );

            return newLocAST;
        }
    }

    private static parseIndexOrNot(currToken: Token, currTokenQueue: Token[]): ExprAST | undefined {
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

    private static parseArgsOrNot(currToken: Token, currTokenQueue: Token[]): ExprAST[] {
        //ArgsOrNot -> Args
        if (this.isStartOfExpr(currToken)) {
            return this.parseArgs(currToken, currTokenQueue);
        }
        //ArgsOrNot -> ε
        else if (currToken.tokenType === TokenType.Token_CloseParen){
            return [];
        }

        else {
            throw new Error(`parseArgsOrNot: Expected the start of an expression or a ), but got ${currToken.lexeme}`);
        }
    }

    private static parseArgs(currToken: Token, currTokenQueue: Token[]): ExprAST[] {
        const exprParser: ExprParser = new ExprParser(currToken, currTokenQueue);

        const newArgumentASTs: ExprAST[] = [exprParser.parseExpr()];

        //If the expression parser terminated at a comma, then place the expression token
        //queue back into the current token queue.
        if (exprParser.currExprToken.tokenType === TokenType.Token_Comma) {
            exprParser.exprTokenQueue.push(
                new Token(currToken.lexeme, currToken.tokenType, currToken.lineCount)
            );

            currToken.reAssign(exprParser.currExprToken);
            currTokenQueue = exprParser.exprTokenQueue.concat(currTokenQueue)
        }
        return newArgumentASTs.concat(
            this.parseArgsTail(currToken, currTokenQueue)
        );
    }

    private static parseArgsTail(currToken: Token, currTokenQueue: Token[]): ExprAST[] {
        if (currToken.tokenType === TokenType.Token_Comma) {
            consume(TokenType.Token_Comma, currToken, currTokenQueue);
            const exprParser: ExprParser = new ExprParser(currToken, currTokenQueue);
            const newArgumentASTs: ExprAST[] = [exprParser.parseExpr()];

            //If the expression parser terminated at a comma, then place the expression token
            //queue back into the current token queue.
            if (exprParser.currExprToken.tokenType === TokenType.Token_Comma) {
                exprParser.exprTokenQueue.push(
                    new Token(currToken.lexeme, currToken.tokenType, currToken.lineCount)
                );
    
                currToken.reAssign(exprParser.currExprToken);
                currTokenQueue = exprParser.exprTokenQueue.concat(currTokenQueue)
            }

            return newArgumentASTs.concat(
                this.parseArgsTail(currToken, currTokenQueue)
            );
        }

        else if (currToken.tokenType === TokenType.Token_CloseParen) {
            return [];
        }

        else {
            throw new Error(`parseArgsTails: Expected ',' or ), but got ${currToken.lexeme}`);
        }
    }

    private static isStartOfExpr(currentToken: Token): boolean {
        return (
            currentToken.tokenType === TokenType.Token_StartParen ||
            currentToken.tokenType === TokenType.Token_Identifier ||
            currentToken.tokenType === TokenType.Token_DecLiteral ||
            currentToken.tokenType === TokenType.Token_StrLiteral ||
            currentToken.tokenType === TokenType.Token_HexLiteral ||
            currentToken.tokenType === TokenType.Token_True ||
            currentToken.tokenType === TokenType.Token_False ||
            currentToken.tokenType === TokenType.Token_Not ||
            currentToken.tokenType === TokenType.Token_Negation ||
            currentToken.tokenType === TokenType.Token_Minus
        );
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