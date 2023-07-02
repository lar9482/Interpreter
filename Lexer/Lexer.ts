import Token from "../Tokens/Token";
import { TokenType } from "../Tokens/TokenType";

export default class Lexer {

    private basicSymbols: RegExp;
    private complexSymbols: RegExp;
    private whitespace: RegExp;

    constructor() {
        this.basicSymbols = new RegExp(/^[\(\{\[\]\}\)\,\;\=\+\-\*\/\%\<\>\!]/);
        this.complexSymbols = new RegExp(/^(<=|>=|==|!=|&&|\|\|)/);
        this.whitespace = new RegExp(/^[\n|\t|\r| ]/);

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

            if (programLine.match(this.complexSymbols)) {

                const token: Token = this.extractLexemeFromProgramLine(
                    programLine,
                    currentLineNumber,
                    this.complexSymbols,
                    this.resolveComplexSymbols
                );

                lineTokens.push(token);
                programLine = programLine.substring(token.lexeme.length, programLine.length);
            }

            else if (programLine.match(this.basicSymbols)) {

                const token: Token = this.extractLexemeFromProgramLine(
                    programLine,
                    currentLineNumber,
                    this.basicSymbols,
                    this.resolveBasicSymbolTokens
                );
                lineTokens.push(token);
                programLine = programLine.substring(token.lexeme.length, programLine.length);
            }

            if (programLine.match(this.whitespace)) {
                const whitespaceLexeme: string = (programLine.match(this.whitespace) as RegExpMatchArray)[0];
                programLine = programLine.substring(whitespaceLexeme.length, programLine.length);
            }
        }

        return lineTokens;
    }

    extractLexemeFromProgramLine(
        programLine: string,
        currentLineNumber: number,
        matchRegex: RegExp,
        resolveToken: (matchedLexeme: string, currentLineNumber: number) => Token
    ): Token {

        const matchedLexeme: string = (programLine.match(matchRegex) as RegExpMatchArray)[0];
        return resolveToken(matchedLexeme, currentLineNumber);;
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

    resolveComplexSymbols(lexeme: string, currentLineNumber: number) {
        switch (lexeme) {
            case "<=":
                return new Token(lexeme, TokenType.Token_LessThanEqual, currentLineNumber);
            case ">=":
                return new Token(lexeme, TokenType.Token_MoreThanEqual, currentLineNumber);
            case "==":
                return new Token(lexeme, TokenType.Token_Equal, currentLineNumber);
            case "!=":
                return new Token(lexeme, TokenType.Token_NotEqual, currentLineNumber);
            case "&&":
                return new Token(lexeme, TokenType.Token_And, currentLineNumber);
            case "||":
                return new Token(lexeme, TokenType.Token_Or, currentLineNumber);
            default:
                throw new Error(`Lexer.resolveComplexSymbols: ${lexeme} is not resolvable`);
        }
    }
}