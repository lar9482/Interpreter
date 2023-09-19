import Token from "../Tokens/Token";
import { TokenType } from "../Tokens/TokenType";
import { NodeType } from "../AST/NodeType";
import { DecafType } from "../AST/DecafType";
import ExprAST from "../AST/ExprAST/ExprAST";
import LiteralAST from "../AST/ExprAST/LiteralAST";
import StrLiteralAST from "../AST/ExprAST/StrLiteralAST";
import IntLiteralAST from "../AST/ExprAST/IntLiteralAST";
import BoolLiteralAST from "../AST/ExprAST/BoolLiteralAST";

import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import { BinaryOpType } from "../AST/ExprAST/ExprTypes/BinaryOpType";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import { UnaryOpType } from "../AST/ExprAST/ExprTypes/UnaryOpType";

import consume from "./consume";
import LocOrFuncCallParser from "./LocOrFuncCallParser";

export default class ExprParser {
    
    currExprToken: Token;
    exprTokenQueue: Token[];
    
    constructor (currentToken: Token, tokenQueue: Token[]) {
        this.exprTokenQueue = this.extractExprTokens(currentToken, tokenQueue);
        this.currExprToken = this.exprTokenQueue.shift() as Token;
    }

    parseExpr(): ExprAST {
        const newExprAST: ExprAST = this.parseExprByShuntingYard();
        return newExprAST;
    }

    private parseExprByShuntingYard(): ExprAST {
        const operandStack: ExprAST[] = [];
        const operatorStack: Token[] = [new Token('ε', TokenType.Token_Epsilon, -1)];

        while (this.exprTokenQueue.length >= 0) {
            if (this.isStartOfExpOperand(this.currExprToken)) {
                const operandAST: ExprAST = this.parseOperand();
                operandStack.push(operandAST);

            } else if (this.isExprOperator(this.currExprToken)) {
                while (operatorStack.length > 0
                    && this.isExprOperator(operatorStack[operatorStack.length - 1])
                    && this.getOperatorPrecedence(operatorStack[operatorStack.length - 1])
                    <= this.getOperatorPrecedence(this.currExprToken)) {

                    const higherOperatorToken: Token = operatorStack.pop() as Token;
                    this.parseNewInternalExprNodes(higherOperatorToken, operandStack);
                }

                operatorStack.push(
                    new Token(this.currExprToken.lexeme, this.currExprToken.tokenType, this.currExprToken.lineCount)
                );

                this.currExprToken.reAssign(this.exprTokenQueue.shift() as Token);

            } else if (this.currExprToken.tokenType === TokenType.Token_StartParen) {
                operatorStack.push(
                    new Token(this.currExprToken.lexeme, this.currExprToken.tokenType, this.currExprToken.lineCount)
                );
                this.currExprToken.reAssign(this.exprTokenQueue.shift() as Token);

            } else if (this.currExprToken.tokenType === TokenType.Token_CloseParen) {

                while (operatorStack.length > 0
                    && operatorStack[operatorStack.length - 1].tokenType !== TokenType.Token_StartParen) {

                    const currOperatorToken: Token = operatorStack.pop() as Token;
                    this.parseNewInternalExprNodes(currOperatorToken, operandStack);
                }
                operatorStack.pop();

                this.currExprToken.reAssign(this.exprTokenQueue.shift() as Token);
            }

            //Handing cases when the sub-expression has ended. It happens if a comma or an epsilon was detected.
            else if (this.currExprToken.tokenType === TokenType.Token_Comma) {
                //Removing the epsilon of the end of the token queue.
                this.exprTokenQueue.pop();                
                break;
            }

            else if (this.currExprToken.tokenType === TokenType.Token_Epsilon){
                break;
            }
        }

        while (operatorStack.length >= 0) {
            const currOperatorToken: Token = operatorStack.pop() as Token;
            this.parseNewInternalExprNodes(currOperatorToken, operandStack);

            if (currOperatorToken.tokenType === TokenType.Token_Epsilon) {
                break;
            }
        }

        return operandStack[0];
    }

    private parseNewInternalExprNodes(currOperatorToken: Token, operandStack: ExprAST[]) {
        if (this.isUnaryExprOperator(currOperatorToken)) {
            const unaryOpType: UnaryOpType = this.getUnaryExprOperatorType(currOperatorToken);
            const childOperand: ExprAST = operandStack.pop() as ExprAST;

            const newUnaryExprAST: UnaryExprAST = new UnaryExprAST(
                NodeType.UNARYOP,
                currOperatorToken.lineCount,
                unaryOpType,
                childOperand
            );

            operandStack.push(newUnaryExprAST);
        } else if (this.isBinaryExprOperator(currOperatorToken)) {
            const binaryOpType: BinaryOpType = this.getBinaryExprOperatorType(currOperatorToken);

            const rightOperand: ExprAST = operandStack.pop() as ExprAST;
            const leftOperand: ExprAST = operandStack.pop() as ExprAST;

            const newBinaryExprAST: BinaryExprAST = new BinaryExprAST(
                NodeType.BINARYOP,
                currOperatorToken.lineCount,
                binaryOpType,
                leftOperand,
                rightOperand
            );

            operandStack.push(newBinaryExprAST);
        }
    }

    private parseOperand(): ExprAST {
        //Operand -> Lit
        if (this.currExprToken.tokenType === TokenType.Token_DecLiteral ||
            this.currExprToken.tokenType === TokenType.Token_StrLiteral ||
            this.currExprToken.tokenType === TokenType.Token_HexLiteral ||
            this.currExprToken.tokenType === TokenType.Token_True ||
            this.currExprToken.tokenType === TokenType.Token_False) {

            return this.parseLiteral();
        }
        //Operand -> LocOrFunc
        else if (this.currExprToken.tokenType === TokenType.Token_Identifier) {

            return LocOrFuncCallParser.parseLocOrFunc(this.currExprToken, this.exprTokenQueue);
        } else {
            throw new Error(`Line ${this.currExprToken.lineCount}: Cannot parse ${this.currExprToken.tokenType} as an operand`);
        }
    }

    private parseLiteral(): LiteralAST {
        //Lit -> DEC
        if (this.currExprToken.tokenType === TokenType.Token_DecLiteral) {
            const intToken: Token = consume(TokenType.Token_DecLiteral, this.currExprToken, this.exprTokenQueue);

            const newIntAST: IntLiteralAST = new IntLiteralAST(
                NodeType.LITERAL,
                intToken.lineCount,
                DecafType.INT,
                parseInt(intToken.lexeme)
            );

            return newIntAST;

        }
        //Lit -> True
        else if (this.currExprToken.tokenType === TokenType.Token_True) {

            const trueBoolToken: Token = consume(TokenType.Token_True, this.currExprToken, this.exprTokenQueue);

            const newTrueBoolAST: BoolLiteralAST = new BoolLiteralAST(
                NodeType.LITERAL,
                trueBoolToken.lineCount,
                DecafType.BOOL,
                true
            );

            return newTrueBoolAST;
        }
        // Lit -> False 
        else if (this.currExprToken.tokenType === TokenType.Token_False) {
            const falseBoolToken: Token = consume(TokenType.Token_False, this.currExprToken, this.exprTokenQueue);

            const newFalseBoolAST: BoolLiteralAST = new BoolLiteralAST(
                NodeType.LITERAL,
                falseBoolToken.lineCount,
                DecafType.BOOL,
                false
            );

            return newFalseBoolAST;
        }
        //Lit -> STR
        else if (this.currExprToken.tokenType === TokenType.Token_StrLiteral) {
            const strToken: Token = consume(TokenType.Token_StrLiteral, this.currExprToken, this.exprTokenQueue);

            const newStrLiteralAST: StrLiteralAST = new StrLiteralAST(
                NodeType.LITERAL,
                strToken.lineCount,
                DecafType.STR,
                strToken.lexeme
            );

            return newStrLiteralAST;

        } else {
            throw new Error(`Line ${this.currExprToken.lineCount}: Unable to parse ${this.currExprToken.tokenType} as a literal.`);
        }
    }

    private extractExprTokens(localCurrentToken: Token, localTokenQueue: Token[]): Token[] {
        const exprTokens: Token[] = [];
        const parenthesisStack: Token[] = [];

        let previousTokenType: TokenType = TokenType.Token_Epsilon;

        while (this.isExprToken(localCurrentToken)) {

            //Attempting to assign context to '-' tokens.
            if (localCurrentToken.tokenType === TokenType.Token_Minus) {
                if (this.hasNegationContext(previousTokenType)) {
                    exprTokens.push(
                        new Token('-', TokenType.Token_Negation, localCurrentToken.lineCount)
                    );
                } else {
                    exprTokens.push(
                        new Token('-', TokenType.Token_Subtraction, localCurrentToken.lineCount)
                    );
                }
            }

            //Do parenthesis balancing
            //Basically, keep a record of the starting parenthesis and brackets in the parenthesis stack.
            //If the stack does not match up with the closing parenthesis or brackets, 
            //then its a sign that the sub-expression has ended.
            else if (localCurrentToken.tokenType === TokenType.Token_StartParen ||
                localCurrentToken.tokenType === TokenType.Token_StartBracket) {
                parenthesisStack.push(
                    new Token(localCurrentToken.lexeme, localCurrentToken.tokenType, localCurrentToken.lineCount)
                );
                exprTokens.push(
                    new Token(localCurrentToken.lexeme, localCurrentToken.tokenType, localCurrentToken.lineCount)
                );
            } else if (localCurrentToken.tokenType === TokenType.Token_CloseParen) {
                if (parenthesisStack.length > 0 
                 && parenthesisStack[parenthesisStack.length - 1].tokenType === TokenType.Token_StartParen) {

                    parenthesisStack.pop();
                    exprTokens.push(
                        new Token(localCurrentToken.lexeme, localCurrentToken.tokenType, localCurrentToken.lineCount)
                    );
                    
                } else {
                    break;
                }
            } else if (localCurrentToken.tokenType === TokenType.Token_CloseBracket) {
                if (parenthesisStack.length > 0 
                 && parenthesisStack[parenthesisStack.length - 1].tokenType === TokenType.Token_StartBracket) {

                    parenthesisStack.pop();
                    exprTokens.push(
                        new Token(localCurrentToken.lexeme, localCurrentToken.tokenType, localCurrentToken.lineCount)
                    );

                } else {
                    break;
                }
            } else {
                exprTokens.push(
                    new Token(localCurrentToken.lexeme, localCurrentToken.tokenType, localCurrentToken.lineCount)
                );
            }

            previousTokenType = localCurrentToken.tokenType;
            localCurrentToken.reAssign(localTokenQueue.shift() as Token);
        }

        exprTokens.push(new Token('ε', TokenType.Token_Epsilon, -1));
        return exprTokens;
    }

    private getOperatorPrecedence(operatorToken: Token): number {
        switch (operatorToken.tokenType) {
            case TokenType.Token_Negation:
                return 1;
            case TokenType.Token_Not:
                return 1;
            case TokenType.Token_Multiply:
                return 2;
            case TokenType.Token_Divide:
                return 2;
            case TokenType.Token_Modus:
                return 2;
            case TokenType.Token_Plus:
                return 3;
            case TokenType.Token_Subtraction:
                return 3;
            case TokenType.Token_LessThan:
                return 4;
            case TokenType.Token_LessThanEqual:
                return 4;
            case TokenType.Token_MoreThan:
                return 4;
            case TokenType.Token_MoreThanEqual:
                return 4;
            case TokenType.Token_Equal:
                return 5;
            case TokenType.Token_NotEqual:
                return 5;
            case TokenType.Token_And:
                return 6;
            case TokenType.Token_Or:
                return 7;
            default:
                throw new Error(`Line ${operatorToken.lineCount}: ${operatorToken.tokenType} can't be assigned operator precedence.`);
        }
    }

    private hasNegationContext(previousTokenType: TokenType) {
        return (
            //Testing if the previous token is at the start of the expression.
            previousTokenType === TokenType.Token_Epsilon ||

            //Testing if the previous token indicates the start of a sub-expression.
            previousTokenType === TokenType.Token_StartParen ||
            previousTokenType === TokenType.Token_StartBracket ||

            //Testing if the previous token is an operator
            previousTokenType === TokenType.Token_Not ||
            previousTokenType === TokenType.Token_Multiply ||
            previousTokenType === TokenType.Token_Divide ||
            previousTokenType === TokenType.Token_Modus ||
            previousTokenType === TokenType.Token_Plus ||
            previousTokenType === TokenType.Token_LessThan ||
            previousTokenType === TokenType.Token_LessThanEqual ||
            previousTokenType === TokenType.Token_MoreThanEqual ||
            previousTokenType === TokenType.Token_MoreThan ||
            previousTokenType === TokenType.Token_And ||
            previousTokenType === TokenType.Token_Or
        )
    }

    private isExprToken(currentToken: Token): boolean {
        return (
            currentToken.tokenType === TokenType.Token_Minus ||

            //Testing if the current token is a unary operation
            this.isUnaryExprOperator(currentToken) ||

            //Testing if the current token is a binary operation
            this.isBinaryExprOperator(currentToken) ||

            //Testing if the current token is a container for sub-expressions
            currentToken.tokenType === TokenType.Token_StartParen ||
            currentToken.tokenType === TokenType.Token_CloseParen ||

            //Testing if the current token is a container for a location or function call
            currentToken.tokenType === TokenType.Token_Identifier ||
            currentToken.tokenType === TokenType.Token_StartBracket ||
            currentToken.tokenType === TokenType.Token_CloseBracket ||
            currentToken.tokenType === TokenType.Token_Comma ||

            //Testing if the current token is a representation of a literal
            currentToken.tokenType === TokenType.Token_DecLiteral ||
            currentToken.tokenType === TokenType.Token_HexLiteral ||
            currentToken.tokenType === TokenType.Token_StrLiteral ||
            currentToken.tokenType === TokenType.Token_True ||
            currentToken.tokenType === TokenType.Token_False
        );
    }

    private isStartOfExpOperand(currentToken: Token): boolean {
        return (
            currentToken.tokenType === TokenType.Token_Identifier ||
            currentToken.tokenType === TokenType.Token_DecLiteral ||
            currentToken.tokenType === TokenType.Token_StrLiteral ||
            currentToken.tokenType === TokenType.Token_HexLiteral ||
            currentToken.tokenType === TokenType.Token_True ||
            currentToken.tokenType === TokenType.Token_False
        )
    }

    private isExprOperator(currentToken: Token): boolean {
        return (
            this.isUnaryExprOperator(currentToken) ||
            this.isBinaryExprOperator(currentToken)
        );
    }

    private isUnaryExprOperator(currentToken: Token) {
        return (
            currentToken.tokenType === TokenType.Token_Negation ||
            currentToken.tokenType === TokenType.Token_Not
        );
    }

    private isBinaryExprOperator(currentToken: Token) {
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

    private getUnaryExprOperatorType(currentToken: Token): UnaryOpType {
        switch (currentToken.tokenType) {
            case TokenType.Token_Negation:
                return UnaryOpType.NEGOP;
            case TokenType.Token_Not:
                return UnaryOpType.NOTOP;
            default:
                throw new Error(`Line ${currentToken.lineCount}: Unable to get ${currentToken} as an unary operator type.`);
        }
    }

    private getBinaryExprOperatorType(currentToken: Token): BinaryOpType {
        switch (currentToken.tokenType) {
            case TokenType.Token_Multiply:
                return BinaryOpType.MULOP;
            case TokenType.Token_Divide:
                return BinaryOpType.DIVOP;
            case TokenType.Token_Modus:
                return BinaryOpType.MODOP;
            case TokenType.Token_Plus:
                return BinaryOpType.ADDOP;
            case TokenType.Token_Subtraction:
                return BinaryOpType.SUBOP;
            case TokenType.Token_LessThan:
                return BinaryOpType.LTOP;
            case TokenType.Token_LessThanEqual:
                return BinaryOpType.LEOP;
            case TokenType.Token_MoreThan:
                return BinaryOpType.GTOP;
            case TokenType.Token_MoreThanEqual:
                return BinaryOpType.GEOP;
            case TokenType.Token_Equal:
                return BinaryOpType.EQOP;
            case TokenType.Token_NotEqual:
                return BinaryOpType.NEQOP;
            case TokenType.Token_And:
                return BinaryOpType.ANDOP;
            case TokenType.Token_Or:
                return BinaryOpType.OROP;
            default:
                throw new Error(`Line ${currentToken.lineCount}: Unable to get ${currentToken} as a binary operator type.`);
        }
    }
}