import Token from "../Tokens/Token";
import { TokenType } from "../Tokens/TokenType";

export default class Lexer {
    private basicSymbols: RegExp;

    constructor() {
        this.basicSymbols = new RegExp(/^[\(\{\[\]\}\)\,\;\=\+\-\*\/\%\<\>\!]/);
    }

    scanProgram(programBuffer: string): Token[] {
        let queueOfTokens: Token[] = [];

        let currentLineNumber: number = 1;
        let programLines: string[] = programBuffer.split(/\n/);

        while (programLines.length > 0) {
            let currentLine: string = programLines.shift() as string;

            queueOfTokens = queueOfTokens.concat(
                this.extractTokensFromProgramLine(currentLine, currentLineNumber)
            );

            currentLineNumber += 1;
        }

        return queueOfTokens;
    }

    extractTokensFromProgramLine(programLine: string, currentLineNumber: number): Token[] {
        let lineTokens: Token[] = [];

        while (programLine.length > 0) {

            if (programLine.match(this.basicSymbols)) {
                const matchedLexeme: string = (programLine.match(this.basicSymbols) as RegExpMatchArray)[0];
                lineTokens.push(
                    this.resolveBasicSymbolTokens(matchedLexeme, currentLineNumber)
                );

                programLine = programLine.substring(matchedLexeme.length, programLine.length);
            }
        }
        return lineTokens;
    }

    resolveBasicSymbolTokens(lexeme: string, currentLineNumber: number): Token {
        switch (lexeme) {
            case "(":
                return new Token(lexeme, TokenType.Token_StartParen, currentLineNumber);
            case "{":
                return new Token(lexeme, TokenType.Token_StartCurly, currentLineNumber);
            case "[":
                return new Token(lexeme, TokenType.Token_StartBracket, currentLineNumber);
            case ")":
                return new Token(lexeme, TokenType.Token_CloseParen, currentLineNumber);
            case "}":
                return new Token(lexeme, TokenType.Token_CloseCurly, currentLineNumber);
            case "]":
                return new Token(lexeme, TokenType.Token_CloseBracket, currentLineNumber);
            case ",":
                return new Token(lexeme, TokenType.Token_Comma, currentLineNumber);
            case ";":
                return new Token(lexeme, TokenType.Token_Semicolon, currentLineNumber);
            case "=":
                return new Token(lexeme, TokenType.Token_Equal, currentLineNumber);
            case "+":
                return new Token(lexeme, TokenType.Token_Plus, currentLineNumber);
            case "-":
                return new Token(lexeme, TokenType.Token_Minus, currentLineNumber);
            case "*":
                return new Token(lexeme, TokenType.Token_Multiply, currentLineNumber);
            case "/":
                return new Token(lexeme, TokenType.Token_Divide, currentLineNumber);
            case "%":
                return new Token(lexeme, TokenType.Token_Modus, currentLineNumber);
            case "<":
                return new Token(lexeme, TokenType.Token_LessThan, currentLineNumber);
            case ">":
                return new Token(lexeme, TokenType.Token_MoreThan, currentLineNumber);
            case "!":
                return new Token(lexeme, TokenType.Token_Not, currentLineNumber);
            default:
                throw new Error(`Lexer.resolveBasicSymbols: ${lexeme} is not resolvable`);
        }
    }
}