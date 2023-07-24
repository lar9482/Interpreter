import Token from "../Tokens/Token";
import { TokenType } from "../Tokens/TokenType";

export default class Lexer {

    private basicSymbols: RegExp;
    private complexSymbols: RegExp;
    private whitespace: RegExp;

    private identifier: RegExp;
    private stringLiteral: RegExp;
    private decimalLiteral: RegExp;

    constructor() {
        //Look for symbols that is one character long
        //This will look for unary, binary, and grouping operators.
        //( { [ ] } ) , ; = + - * / % < > !
        this.basicSymbols = new RegExp(/^[\(\{\[\]\}\)\,\;\=\+\-\*\/\%\<\>\!]/);

        //Look for symbols that are two characters long.
        //This will look for boolean operators basically.
        //<=, >=, ==, !=, &&, ||
        this.complexSymbols = new RegExp(/^(<=|>=|==|!=|&&|\|\|)/);

        //Look for whitespace(newlines, tabs, spaces)
        this.whitespace = new RegExp(/^[\n|\t|\r| ]/);

        //Look for identifiers
        //Strings that begin with an alphabetical character and
        //contain any amount of alphanumeric characters as well as an underscore
        this.identifier = new RegExp(/^[a-zA-Z]{1}[a-zA-Z0-9_]*/);

        //Look for string literals(Basically a stream of characters enclosed in double quotations)
        this.stringLiteral = new RegExp(/^"\n*[\x00-\x7F]*\t*\\*"/);

        //Look for raw decimal literals
        this.decimalLiteral = new RegExp(/^(-|)([0-9]+)/);
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

    private extractTokensFromProgramLine(programLine: string, currentLineNumber: number): Token[] {
        let lineTokens: Token[] = [];

        while (programLine.length > 0) {

            if (programLine.match(this.identifier)) {

                const token: Token = this.extractLexemeFromProgramLine(
                    programLine,
                    currentLineNumber,
                    this.identifier,
                    this.resolveIdentifiersAndReservedWords
                );
                lineTokens.push(token);
                programLine = programLine.substring(token.lexeme.length, programLine.length);
            }

            else if (programLine.match(this.decimalLiteral)) {
                const lexeme: string = (programLine.match(this.decimalLiteral) as RegExpMatchArray)[0];
                const token: Token = new Token(lexeme, TokenType.Token_DecLiteral, currentLineNumber);

                lineTokens.push(token);
                programLine = programLine.substring(token.lexeme.length, programLine.length);
            }


            else if (programLine.match(this.complexSymbols)) {

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

            else if (programLine.match(this.stringLiteral)) {
                const lexeme: string = (programLine.match(this.stringLiteral) as RegExpMatchArray)[0];
                const token: Token = new Token(lexeme, TokenType.Token_StrLiteral, currentLineNumber);

                lineTokens.push(token);
                programLine = programLine.substring(token.lexeme.length, programLine.length);
            }
            
            else if (programLine.match(this.whitespace)) {

                const whitespaceLexeme: string = (programLine.match(this.whitespace) as RegExpMatchArray)[0];
                programLine = programLine.substring(whitespaceLexeme.length, programLine.length);
            }
            else {
                throw new Error(`Lexer.extractTokensFromProgramLine: ${programLine} is not resolvable`);
            }
        }

        return lineTokens;
    }

    private extractLexemeFromProgramLine(
        programLine: string,
        currentLineNumber: number,
        matchRegex: RegExp,
        resolveToken: (matchedLexeme: string, currentLineNumber: number) => Token
    ): Token {

        const matchedLexeme: string = (programLine.match(matchRegex) as RegExpMatchArray)[0];
        return resolveToken(matchedLexeme, currentLineNumber);
    }

    private resolveBasicSymbolTokens(lexeme: string, currentLineNumber: number): Token {
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
                return new Token(lexeme, TokenType.Token_Assign, currentLineNumber);
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

    private resolveComplexSymbols(lexeme: string, currentLineNumber: number) {
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

    private resolveIdentifiersAndReservedWords(lexeme: string, currentLineNumber: number) {
        switch (lexeme) {
            case "def":
                return new Token(lexeme, TokenType.Token_Def, currentLineNumber);
            case "if":
                return new Token(lexeme, TokenType.Token_If, currentLineNumber);
            case "else":
                return new Token(lexeme, TokenType.Token_Else, currentLineNumber);
            case "while":
                return new Token(lexeme, TokenType.Token_While, currentLineNumber);
            case "return":
                return new Token(lexeme, TokenType.Token_Return, currentLineNumber);
            case "break":
                return new Token(lexeme, TokenType.Token_Break, currentLineNumber);
            case "continue":
                return new Token(lexeme, TokenType.Token_Continue, currentLineNumber);
            case "int":
                return new Token(lexeme, TokenType.Token_Int, currentLineNumber);
            case "bool":
                return new Token(lexeme, TokenType.Token_Bool, currentLineNumber);
            case "void":
                return new Token(lexeme, TokenType.Token_Void, currentLineNumber);
            case "true":
                return new Token(lexeme, TokenType.Token_True, currentLineNumber);
            case "false":
                return new Token(lexeme, TokenType.Token_False, currentLineNumber);
            default:
                return new Token(lexeme, TokenType.Token_Identifier, currentLineNumber);
        }
    }
}