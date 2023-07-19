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

import ExprParser from "./ExprParser";

import consume from "./consume";

export default class Parser {

    tokenQueue: Token[];
    currentToken: Token;

    constructor(tokenQueue: Token[]) {
        this.tokenQueue = tokenQueue;
        this.currentToken = this.tokenQueue.shift() as Token;
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
        const identifier: Token = consume(TokenType.Token_Identifier, this.currentToken, this.tokenQueue);
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
            consume(TokenType.Token_Int, this.currentToken, this.tokenQueue);
            return DecafType.INT;
        }

        //Type -> bool
        else if (this.currentToken.tokenType === TokenType.Token_Bool) {
            consume(TokenType.Token_Bool, this.currentToken, this.tokenQueue);
            return DecafType.BOOL;
        }

        //Type -> void
        else if (this.currentToken.tokenType === TokenType.Token_Void) {
            consume(TokenType.Token_Void, this.currentToken, this.tokenQueue);
            return DecafType.VOID;
        }
        else {
            throw new Error("parseType: Didn't get int, bool, or void tokens");
        }
    }

    private parseVar_Prime(): number {
        //Var_Prime -> [ DEC ] ;
        if (this.currentToken.tokenType === TokenType.Token_StartBracket) {
            consume(TokenType.Token_StartBracket, this.currentToken, this.tokenQueue);

            const decimalToken: Token = consume(TokenType.Token_DecLiteral, this.currentToken, this.tokenQueue);

            consume(TokenType.Token_CloseBracket, this.currentToken, this.tokenQueue);
            consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

            return parseInt(decimalToken.lexeme);
        }

        //Var_Prime -> ;
        else if (this.currentToken.tokenType === TokenType.Token_Semicolon) {
            consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

            return 0;
        }

        else {
            throw new Error("parseVar_Prime: Didn't detect [ or ; at the start");
        }
    }

    private parseFunc(): FuncDeclAST {
        //Func -> def Type ID ( ParamsOrNot ) Block
        const defToken: Token = consume(TokenType.Token_Def, this.currentToken, this.tokenQueue);

        const functionReturnType: DecafType = this.parseType();
        const identifierToken: Token = consume(TokenType.Token_Identifier, this.currentToken, this.tokenQueue);

        consume(TokenType.Token_StartParen, this.currentToken, this.tokenQueue);

        const parameterASTList: ParameterAST[] = this.parseParamsOrNot();

        consume(TokenType.Token_CloseParen, this.currentToken, this.tokenQueue);

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
            consume(TokenType.Token_Comma, this.currentToken, this.tokenQueue);

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
        const paramIdentifier: Token = consume(TokenType.Token_Identifier, this.currentToken, this.tokenQueue);

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
        const startBlockToken: Token = consume(TokenType.Token_StartCurly, this.currentToken, this.tokenQueue);

        const newVarDeclASTList: VarDeclAST[] = this.parseVarBlock();
        const newStmtASTList: StmtAST[] = this.parseStmtBlock();

        consume(TokenType.Token_CloseCurly, this.currentToken, this.tokenQueue);

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
            const returnToken: Token = consume(TokenType.Token_Return, this.currentToken, this.tokenQueue);
            const returnExpr: ExprAST | undefined = this.parseReturnExprOrNot();

            consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

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

            const exprParser: ExprParser = new ExprParser(
                this.currentToken, this.tokenQueue
            );

            const newExprAST: ExprAST = exprParser.parseExpr();

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
}