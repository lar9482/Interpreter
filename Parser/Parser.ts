import AST from "../AST/AST";
import BlockAST from "../AST/BlockAST";
import { DecafType } from "../AST/DecafType";
import ExprAST from "../AST/ExprAST/ExprAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import { NodeType } from "../AST/NodeType";
import ParameterAST from "../AST/ParameterAST";
import ProgramAST from "../AST/ProgramAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import StmtAST from "../AST/StmtAST/StmtAST";
import VarDeclAST from "../AST/VarDeclAST";
import LocAST from "../AST/ExprAST/LocAST";
import Token from "../Tokens/Token"
import { TokenType } from "../Tokens/TokenType";

import ExprParser from "./ExprParser";
import LocOrFuncCallParser from "./LocOrFuncCallParser";

import consume from "./consume";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import BreakStmtAST from "../AST/StmtAST/BreakStmtAST";
import ContinueStmtAST from "../AST/StmtAST/ContinueStmtAST";

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
            throw new Error(`Line ${this.currentToken.lineCount}: Expected int, bool, void, or def, but got ${this.currentToken.lexeme}`);
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
            throw new Error(`Line ${this.currentToken.lineCount}: Expected int, bool, or void, but got ${this.currentToken.lexeme}`);
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
            throw new Error(`Line ${this.currentToken.lineCount}: While parsing the details of the variable declaration,
            [ or ; were expected, but got ${this.currentToken.lineCount}`);
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
            throw new Error(`Line ${this.currentToken.lineCount}: While parsing the beginning of function parameters,
            int, bool, void, and ) were expected, but got ${this.currentToken.lexeme}`);
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
            throw new Error(`Line ${this.currentToken.lineCount}: While parsing a parameter, ',' or ) were expected,
            but got ${this.currentToken.lexeme}`);
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
            throw new Error(`Line ${this.currentToken.lineCount}: While parsing variable declarations encoded within a block,
            int, bool, void, {, identifier, if, while, return, break, continue were expected, but got ${this.currentToken.lexeme}`);
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
            
            const newStmtAST: StmtAST | undefined = this.parseStmt();
            
            if (newStmtAST) {
                newStmtASTList.push(newStmtAST);
            }

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
            throw new Error(`Line ${this.currentToken.lineCount}: Expected {, identifier, if, while, return, break, continue, but got ${this.currentToken.lexeme}`)
        }
    }

    private parseStmt(): StmtAST | undefined {

        //Stmt -> LocOrFunc
        if (this.currentToken.tokenType === TokenType.Token_Identifier) {
            const locOrFuncAST: ExprAST = LocOrFuncCallParser.parseLocOrFunc(this.currentToken, this.tokenQueue);

            //Stmt -> Loc = Expr ;
            if (locOrFuncAST.type === NodeType.LOCATION) {
                consume(TokenType.Token_Assign, this.currentToken, this.tokenQueue);

                const assignmentExprParser: ExprParser = new ExprParser(this.currentToken, this.tokenQueue);
                const assignmentExprAST: ExprAST = assignmentExprParser.parseExpr();

                consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

                const newAssignStmtAST: AssignStmtAST = new AssignStmtAST(
                    NodeType.ASSIGNMENT,
                    locOrFuncAST.sourceLineNumber,
                    locOrFuncAST as LocAST,
                    assignmentExprAST
                );

                return newAssignStmtAST;
            } 

            //Stmt -> FuncCall ;
            else if (locOrFuncAST.type === NodeType.FUNCCALL){
                consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

                return locOrFuncAST;
            }
        }
        //Stmt -> if ( Expr ) Block parseElseOrNot
        else if (this.currentToken.tokenType === TokenType.Token_If) {
            const ifToken: Token = consume(TokenType.Token_If, this.currentToken, this.tokenQueue);
            consume(TokenType.Token_StartParen, this.currentToken, this.tokenQueue);

            const exprParser: ExprParser = new ExprParser(this.currentToken, this.tokenQueue);
            const conditionalExprAST: ExprAST = exprParser.parseExpr();

            consume(TokenType.Token_CloseParen, this.currentToken, this.tokenQueue);

            const ifBlockAST: BlockAST = this.parseBlock();

            const elseBlockASTOrNot: BlockAST | undefined = this.parseElseBlockOrNot();

            const newConditionalStmtAST: ConditionalStmtAST = new ConditionalStmtAST(
                NodeType.CONDITIONAL,
                ifToken.lineCount,
                conditionalExprAST,
                ifBlockAST,
                elseBlockASTOrNot
            );

            return newConditionalStmtAST;
        }
        //Stmt -> while ( Expr ) Block
        else if (this.currentToken.tokenType === TokenType.Token_While) {
            const whileToken: Token = consume(TokenType.Token_While, this.currentToken, this.tokenQueue);
            consume(TokenType.Token_StartParen, this.currentToken, this.tokenQueue);

            const exprParser: ExprParser = new ExprParser(this.currentToken, this.tokenQueue);
            const conditionBlockAST: ExprAST = exprParser.parseExpr();

            consume(TokenType.Token_CloseParen, this.currentToken, this.tokenQueue);
            
            const bodyBlockAST: BlockAST = this.parseBlock();

            const newWhileLoopStmtAST: WhileLoopStmtAST = new WhileLoopStmtAST(
                NodeType.WHILELOOP,
                whileToken.lineCount,
                conditionBlockAST,
                bodyBlockAST
            );

            return newWhileLoopStmtAST;
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
            const breakToken: Token = consume(TokenType.Token_Break, this.currentToken, this.tokenQueue);

            consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

            const newBreakStmtAST: BreakStmtAST = new BreakStmtAST(
                NodeType.BREAKSTMT,
                breakToken.lineCount
            );

            return newBreakStmtAST;
        }
        //Stmt -> continue ;
        else if (this.currentToken.tokenType === TokenType.Token_Continue) {
            const continueToken: Token = consume(TokenType.Token_Continue, this.currentToken, this.tokenQueue);

            consume(TokenType.Token_Semicolon, this.currentToken, this.tokenQueue);

            const newContinueStmtAST: ContinueStmtAST = new ContinueStmtAST(
                NodeType.CONTINUESTMT,
                continueToken.lineCount
            );

            return newContinueStmtAST;
        } 
        
        else {
            throw new Error(`Line ${this.currentToken.lineCount}: Unable to parse statement.`);
        }
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
            throw new Error(`Line ${this.currentToken.lineCount}: While beginning to parse return expressions, 
            (, ID, decimal, string, hexadecimal, true, false, -, !, or ; were expected but got ${this.currentToken.lexeme}`);
        }
    }

    private parseElseBlockOrNot(): BlockAST | undefined {
        if (this.currentToken.tokenType === TokenType.Token_Else) {
            consume(TokenType.Token_Else, this.currentToken, this.tokenQueue);

            const elseBlockAST: BlockAST = this.parseBlock();

            return elseBlockAST;
        }
        else {
            return undefined;
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