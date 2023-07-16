import { TokenType } from "./TokenType";

export default class Token {

    lexeme: string;
    lineCount: number;
    tokenType: TokenType;

    constructor(lexeme: string, tokenType: TokenType, lineCount: number) {
        this.lexeme = lexeme;
        this.lineCount = lineCount;
        this.tokenType = tokenType;
    }

    reAssign(token: Token) {
        this.lexeme = token.lexeme;
        this.lineCount = token.lineCount;
        this.tokenType = token.tokenType;
    }
}