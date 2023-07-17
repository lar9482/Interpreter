import AST from "../AST/AST";
import BlockAST from "../AST/BlockAST";
import { DecafType } from "../AST/DecafType";
import ExprAST from "../AST/ExprAST/ExprAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import { NodeType } from "../AST/NodeType";
import ParameterAST from "../AST/ParameterAST";
import ProgramAST from "../AST/ProgramAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import StmtAST from "../AST/StmtAST/StmtAST";
import VarDeclAST from "../AST/VarDeclAST";
import Token from "../Tokens/Token"
import { TokenType } from "../Tokens/TokenType";
import LiteralAST from "../AST/ExprAST/LiteralAST";
import IntLiteralAST from "../AST/ExprAST/IntLiteralAST";
import BoolLiteralAST from "../AST/ExprAST/BoolLiteralAST";
import StrLiteralAST from "../AST/ExprAST/StrLiteralAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import { UnaryOpType } from "../AST/ExprAST/UnaryOpType";
import { BinaryOpType } from "../AST/ExprAST/BinaryOpType";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";

export default class Parser {

    tokenQueue: Token[];
    currentToken: Token;

    expressionTokenQueueStack: Token[][];
    expressionCurrentTokenStack: Token[];

    constructor(tokenQueue: Token[]) {
        this.tokenQueue = tokenQueue;
        this.currentToken = this.tokenQueue.shift() as Token;

        this.expressionCurrentTokenStack = [];
        this.expressionTokenQueueStack = [];
    }

    parseProgram(): ProgramAST {

        const newProgramAST: ProgramAST = new ProgramAST(
            NodeType.PROGRAM,
            this.currentToken.lineCount,
            [], //initializing list to hold variables
            [] // initialising list to hold functions
        );

        //Program -> VarOrFunc Program
        if (this.currentToken.tokenType !== TokenType.Token_Epsilon) {
            const newAST: AST = this.parseVarOrFunc();

            if (newAST.type === NodeType.VARDECL) {
                newProgramAST.variables.push(newAST as VarDeclAST);
            }
            else if (newAST.type === NodeType.FUNCDECL) {
                newProgramAST.functions.push(newAST as FuncDeclAST);
            }

            const subProgramAST: ProgramAST = this.parseProgram();
            newProgramAST.variables = newProgramAST.variables.concat(subProgramAST.variables);
            newProgramAST.functions = newProgramAST.functions.concat(subProgramAST.functions);
        }

        return newProgramAST;
    }

    private parseVarOrFunc(): AST {
        //VarOrFunc -> Var
        if (this.currentToken.tokenType === TokenType.Token_Int
            || this.currentToken.tokenType === TokenType.Token_Bool
            || this.currentToken.tokenType === TokenType.Token_Void
        ) {

            const newVarDeclAST: VarDeclAST = this.parseVar();
            return newVarDeclAST;
        }

        //VarOrFunc -> Func
        else if (this.currentToken.tokenType === TokenType.Token_Def) {

            const newFuncDeclAST: FuncDeclAST = this.parseFunc();
            return newFuncDeclAST;
        }

        else {
            throw new Error("parseVarOrFunc: Didn't get int, bool, void, or def tokens");
        }
    }

    private parseVar(): VarDeclAST {
        //Var -> Type ID Var_Prime
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
        //Type -> int
        if (this.currentToken.tokenType === TokenType.Token_Int) {
            this.match(TokenType.Token_Int);

            return DecafType.INT;
        }

        //Type -> bool
        else if (this.currentToken.tokenType === TokenType.Token_Bool) {
            this.match(TokenType.Token_Bool);

            return DecafType.BOOL;
        }

        //Type -> void
        else if (this.currentToken.tokenType === TokenType.Token_Void) {
            this.match(TokenType.Token_Void)

            return DecafType.VOID;
        }
        else {
            throw new Error("parseType: Didn't get int, bool, or void tokens");
        }
    }

    private parseVar_Prime(): number {
        //Var_Prime -> [ DEC ] ;
        if (this.currentToken.tokenType === TokenType.Token_StartBracket) {
            this.match(TokenType.Token_StartBracket);

            const decimalToken: Token = this.match(TokenType.Token_DecLiteral);

            this.match(TokenType.Token_CloseBracket);
            this.match(TokenType.Token_Semicolon);

            return parseInt(decimalToken.lexeme);
        }

        //Var_Prime -> ;
        else if (this.currentToken.tokenType === TokenType.Token_Semicolon) {
            this.match(TokenType.Token_Semicolon);

            return 0;
        }

        else {
            throw new Error("parseVar_Prime: Didn't detect [ or ; at the start");
        }
    }

    private parseFunc(): FuncDeclAST {
        //Func -> def Type ID ( ParamsOrNot ) Block
        const defToken: Token = this.match(TokenType.Token_Def);

        const functionReturnType: DecafType = this.parseType();
        const identifierToken: Token = this.match(TokenType.Token_Identifier);

        this.match(TokenType.Token_StartParen);

        const parameterASTList: ParameterAST[] = this.parseParamsOrNot();

        this.match(TokenType.Token_CloseParen);

        const blockAST: BlockAST = this.parseBlock();

        const newFuncDeclAST: FuncDeclAST = new FuncDeclAST(
            NodeType.FUNCDECL,
            defToken.lineCount,
            identifierToken.lexeme,
            functionReturnType,
            parameterASTList,
            blockAST
        );

        return newFuncDeclAST;
    }

    private parseParamsOrNot(): ParameterAST[] {

        //ParamsOrNot -> Params
        if (this.currentToken.tokenType === TokenType.Token_Int
            || this.currentToken.tokenType === TokenType.Token_Bool
            || this.currentToken.tokenType === TokenType.Token_Void) {
            return this.parseParams();
        }

        //Params -> ε
        else if (this.currentToken.tokenType === TokenType.Token_CloseParen) {
            return [];
        }

        else {
            throw new Error("parseParamsOrNot: Didn't detect int, bool, void, or ) at the start");
        }
    }

    private parseParams(): ParameterAST[] {
        //Params -> Param ParamsTail

        let parameterASTList: ParameterAST[] = [];

        parameterASTList.push(
            this.parseParam()
        );

        parameterASTList = parameterASTList.concat(
            this.parseParamsTail()
        );

        return parameterASTList;
    }

    private parseParamsTail(): ParameterAST[] {

        //ParamsTail -> , Param ParamsTail
        if (this.currentToken.tokenType === TokenType.Token_Comma) {
            this.match(TokenType.Token_Comma);

            let nestedParameterASTList: ParameterAST[] = [];

            nestedParameterASTList.push(
                this.parseParam()
            );

            nestedParameterASTList = nestedParameterASTList.concat(
                this.parseParamsTail()
            );

            return nestedParameterASTList;
        }

        //ParamsTail -> ε
        else if (this.currentToken.tokenType === TokenType.Token_CloseParen) {

            return [];
        }

        else {
            throw new Error("parseParamsOrNot: Didn't detect , or ) at the start");
        }
    }

    private parseParam(): ParameterAST {
        //Param -> Type ID
        const type: DecafType = this.parseType();
        const paramIdentifier: Token = this.match(TokenType.Token_Identifier);

        const newParameterAST: ParameterAST = new ParameterAST(
            NodeType.PARAMETER,
            paramIdentifier.lineCount,
            paramIdentifier.lexeme,
            type
        )

        return newParameterAST;
    }

    private parseBlock(): BlockAST {
        //Block -> { VarBlock StmtBlock }
        const startBlockToken: Token = this.match(TokenType.Token_StartCurly);

        const newVarDeclASTList: VarDeclAST[] = this.parseVarBlock();
        const newStmtASTList: StmtAST[] = this.parseStmtBlock();

        this.match(TokenType.Token_CloseCurly);

        return new BlockAST(
            NodeType.BLOCK,
            startBlockToken.lineCount,
            newVarDeclASTList,
            newStmtASTList
        );
    }

    private parseVarBlock(): VarDeclAST[] {
        //VarBlock -> Var VarBlock
        if (this.currentToken.tokenType === TokenType.Token_Int
            || this.currentToken.tokenType === TokenType.Token_Bool
            || this.currentToken.tokenType === TokenType.Token_Void) {

            let newVarDeclASTList: VarDeclAST[] = [];

            newVarDeclASTList.push(
                this.parseVar()
            );

            newVarDeclASTList = newVarDeclASTList.concat(
                this.parseVarBlock()
            );

            return newVarDeclASTList;
        }

        //VarBlock -> ε
        else if (this.currentToken.tokenType === TokenType.Token_CloseCurly ||
            this.currentToken.tokenType === TokenType.Token_Identifier ||
            this.currentToken.tokenType === TokenType.Token_If ||
            this.currentToken.tokenType === TokenType.Token_While ||
            this.currentToken.tokenType === TokenType.Token_Return ||
            this.currentToken.tokenType === TokenType.Token_Break ||
            this.currentToken.tokenType === TokenType.Token_Continue) {

            return [];
        }

        else {
            throw new Error('parseVarBlock: expected int, bool, void, {, identifier, if, while, return, break, continue');
        }
    }

    private parseStmtBlock(): StmtAST[] {

        //StmtBlock -> Stmt StmtBlock
        if (this.currentToken.tokenType === TokenType.Token_Identifier ||
            this.currentToken.tokenType === TokenType.Token_If ||
            this.currentToken.tokenType === TokenType.Token_While ||
            this.currentToken.tokenType === TokenType.Token_Return ||
            this.currentToken.tokenType === TokenType.Token_Break ||
            this.currentToken.tokenType === TokenType.Token_Continue) {

            let newStmtASTList: StmtAST[] = [];

            newStmtASTList.push(
                this.parseStmt()
            );

            newStmtASTList = newStmtASTList.concat(
                this.parseStmtBlock()
            );

            return newStmtASTList;
        }

        //StmtBlock -> ε
        else if (this.currentToken.tokenType === TokenType.Token_CloseCurly) {
            return [];
        }

        else {
            throw new Error('parseStmtBlock: expected {, identifier, if, while, return, break, continue')
        }
    }

    private parseStmt(): StmtAST {

        //Stmt -> ID LocOrFunc ;
        if (this.currentToken.tokenType === TokenType.Token_Identifier) {

        }
        //Stmt -> if ( Expr ) Block parseElseOrNot
        else if (this.currentToken.tokenType === TokenType.Token_If) {

        }
        //Stmt -> while ( Expr ) Block
        else if (this.currentToken.tokenType === TokenType.Token_While) {

        }
        //Stmt -> return parseReturnExprOrNot ; 
        else if (this.currentToken.tokenType === TokenType.Token_Return) {
            const returnToken: Token = this.match(TokenType.Token_Return);
            const returnExpr: ExprAST | undefined = this.parseReturnExprOrNot();

            this.match(TokenType.Token_Semicolon);

            const newReturnStmtAST: ReturnStmtAST = new ReturnStmtAST(
                NodeType.RETURNSTMT,
                returnToken.lineCount,
                returnExpr
            );

            return newReturnStmtAST;
        }
        //Stmt -> break ;
        else if (this.currentToken.tokenType === TokenType.Token_Break) {

        }
        //Stmt -> continue ;
        else if (this.currentToken.tokenType === TokenType.Token_Continue) {

        }

        return new StmtAST(NodeType.ASSIGNMENT, 0);
    }

    private parseReturnExprOrNot(): ExprAST | undefined {
        //Testing if the token queue starts with a token that indicates the beginning of an expression.
        if (this.isStartOfExpr(this.currentToken)) {
            const newExprAST: ExprAST = this.parseExpr(this.currentToken, this.tokenQueue)

            return newExprAST;
        }

        //returnExprOrNot -> ε
        else if (this.currentToken.tokenType === TokenType.Token_Semicolon) {
            return undefined;
        }

        else {
            throw new Error("parseReturnExprOrNot: Didn't detect (, ID, decimal, string, hexadecimal, true, false, -, !, or ; at the start");
        }
    }

    private parseExpr(currentToken: Token, tokenQueue: Token[]): ExprAST {
        const extractedExprTokenQueue: Token[] = this.extractExprTokens(currentToken, tokenQueue);
        const extractedCurrentExprToken: Token = extractedExprTokenQueue.shift() as Token;

        // this.expressionCurrentTokenStack.push(
        //     extractedCurrentExprToken
        // )
        // this.expressionTokenQueueStack.push(
        //     extractedExprTokenQueue
        // );

        const newExprAST: ExprAST = this.parseExprByShuntingYard(extractedCurrentExprToken, extractedExprTokenQueue);

        // this.expressionCurrentTokenStack.pop();
        // this.expressionTokenQueueStack.pop();

        return newExprAST;
    }

    private parseExprByShuntingYard(currentExprToken: Token, exprTokenQueue: Token[]): ExprAST {
        const operandStack: ExprAST[] = [];
        const operatorStack: Token[] = [new Token('ε', TokenType.Token_Epsilon, -1)];

        while (exprTokenQueue.length >= 0) {
            if (this.isStartOfExpOperand(currentExprToken)) {
                const operandAST: ExprAST = this.parseOperand(currentExprToken, exprTokenQueue);
                operandStack.push(operandAST);

            } else if (this.isExprOperator(currentExprToken)) {
                while (operatorStack.length > 0
                    && this.isExprOperator(operatorStack[operatorStack.length - 1])
                    && this.getOperatorPrecedence(operatorStack[operatorStack.length - 1])
                    <= this.getOperatorPrecedence(currentExprToken)) {

                    const higherOperatorToken: Token = operatorStack.pop() as Token;
                    this.parseNewInternalExprNodes(higherOperatorToken, operandStack);
                }

                operatorStack.push(
                    new Token(currentExprToken.lexeme, currentExprToken.tokenType, currentExprToken.lineCount)
                );

                currentExprToken.reAssign(exprTokenQueue.shift() as Token);

            } else if (currentExprToken.tokenType === TokenType.Token_StartParen) {
                operatorStack.push(
                    new Token(currentExprToken.lexeme, currentExprToken.tokenType, currentExprToken.lineCount)
                );
                currentExprToken.reAssign(exprTokenQueue.shift() as Token);

            } else if (currentExprToken.tokenType === TokenType.Token_CloseParen) {

                while (operatorStack.length > 0
                    && operatorStack[operatorStack.length - 1].tokenType !== TokenType.Token_StartParen) {

                    const currOperatorToken: Token = operatorStack.pop() as Token;
                    this.parseNewInternalExprNodes(currOperatorToken, operandStack);
                }
                operatorStack.pop();

                currentExprToken.reAssign(exprTokenQueue.shift() as Token);
            }
            else if (currentExprToken.tokenType === TokenType.Token_Epsilon) {
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

    private parseOperand(currentExprToken: Token, exprTokenQueue: Token[]): ExprAST {
        //Operand -> Lit
        if (currentExprToken.tokenType === TokenType.Token_DecLiteral ||
            currentExprToken.tokenType === TokenType.Token_StrLiteral ||
            currentExprToken.tokenType === TokenType.Token_HexLiteral ||
            currentExprToken.tokenType === TokenType.Token_True ||
            currentExprToken.tokenType === TokenType.Token_False) {

            return this.parseLiteral(currentExprToken, exprTokenQueue);
        }
        //Operand -> ID LocOrFunc
        else if (currentExprToken.tokenType === TokenType.Token_Identifier) {

            return new ExprAST(NodeType.LOCATION, 0);
        } else {
            throw new Error(`parseOperand: Cannot parse ${currentExprToken.tokenType}`);
        }
    }

    private parseLiteral(currentExprToken: Token, exprTokenQueue: Token[]): LiteralAST {
        //Lit -> DEC
        if (currentExprToken.tokenType === TokenType.Token_DecLiteral) {
            const intToken: Token = this.matchForNestedQueue(TokenType.Token_DecLiteral, currentExprToken, exprTokenQueue);

            const newIntAST: IntLiteralAST = new IntLiteralAST(
                NodeType.LITERAL,
                intToken.lineCount,
                DecafType.INT,
                parseInt(intToken.lexeme)
            );

            return newIntAST;

        }
        //Lit -> True
        else if (currentExprToken.tokenType === TokenType.Token_True) {

            const trueBoolToken: Token = this.matchForNestedQueue(TokenType.Token_True, currentExprToken, exprTokenQueue);

            const newTrueBoolAST: BoolLiteralAST = new BoolLiteralAST(
                NodeType.LITERAL,
                trueBoolToken.lineCount,
                DecafType.BOOL,
                true
            );

            return newTrueBoolAST;
        }
        // Lit -> False 
        else if (currentExprToken.tokenType === TokenType.Token_False) {
            const falseBoolToken: Token = this.matchForNestedQueue(TokenType.Token_False, currentExprToken, exprTokenQueue);

            const newFalseBoolAST: BoolLiteralAST = new BoolLiteralAST(
                NodeType.LITERAL,
                falseBoolToken.lineCount,
                DecafType.BOOL,
                false
            );

            return newFalseBoolAST;
        }
        //Lit -> STR
        else if (currentExprToken.tokenType === TokenType.Token_StrLiteral) {
            const strToken: Token = this.matchForNestedQueue(TokenType.Token_StrLiteral, currentExprToken, exprTokenQueue);

            const newStrLiteralAST: StrLiteralAST = new StrLiteralAST(
                NodeType.LITERAL,
                strToken.lineCount,
                DecafType.STR,
                strToken.lexeme
            );

            return newStrLiteralAST;

        } else {
            throw new Error(`parseLiteral: unable to parse ${currentExprToken.tokenType}`);
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
                if (parenthesisStack.length > 0 && parenthesisStack[parenthesisStack.length - 1].tokenType === TokenType.Token_StartParen) {
                    parenthesisStack.pop();
                    exprTokens.push(
                        new Token(localCurrentToken.lexeme, localCurrentToken.tokenType, localCurrentToken.lineCount)
                    );
                } else {
                    break;
                }
            } else if (localCurrentToken.tokenType === TokenType.Token_CloseBracket) {
                if (parenthesisStack.length > 0 && parenthesisStack[parenthesisStack.length - 1].tokenType === TokenType.Token_StartBracket) {
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

    private matchForNestedQueue(expectedTokenType: TokenType, currentToken: Token, tokenQueue: Token[]): Token {
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
            throw new Error(`${expectedTokenType.toString()} expected, but found ${currentToken}`);
        }
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
                throw new Error(`getOperatorPrecedence: ${operatorToken.tokenType} can't be assigned precedence`);
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

    private isStartOfExpr(currentToken: Token): boolean {
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
                throw new Error(`getUnaryExprOperatorType: Unable to get ${currentToken} type.`);
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
                throw new Error(`getBinaryExprOperatorType: Unable to get ${currentToken} type.`);
        }
    }
}