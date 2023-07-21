import Token from "../Tokens/Token";
import { TokenType } from "../Tokens/TokenType";

export default function consume(expectedTokenType: TokenType, currentToken: Token, tokenQueue: Token[]): Token {
    if (currentToken.tokenType === expectedTokenType) {

        const newToken: Token = new Token(
            currentToken.lexeme,
            currentToken.tokenType,
            currentToken.lineCount
        );
        currentToken.reAssign(tokenQueue.shift() as Token);

        return newToken;
    }
    else {
        throw new Error(`Line ${currentToken.lineCount}: ${expectedTokenType.toString()} expected, but found ${currentToken.lexeme}`);
    }
}