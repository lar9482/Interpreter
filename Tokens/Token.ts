import { TokenType } from "./TokenType";

export default class Token {

    private lexeme: string;
    private lineCount: number;
    private tokenType: TokenType;

    constructor(lexeme: string, lineCount: number, tokenType: TokenType) {
        this.lexeme = lexeme;
        this.lineCount = lineCount;
        this.tokenType = tokenType;
    }
}