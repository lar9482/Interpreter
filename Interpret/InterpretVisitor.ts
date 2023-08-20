import interpretVisitorInterface from "./InterpretVisitorInterface";
import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";

import SymbolFunction from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolFunction";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";

import { cloneDeep } from "lodash";
import AST from "../AST/AST";
import { NodeType } from "../AST/NodeType";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import ExprAST from "../AST/ExprAST/ExprAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import LocAST from "../AST/ExprAST/LocAST";
import SymbolScalar from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolScalar";

export default class InterpretVisitor implements interpretVisitorInterface{

    private globalScope: SymbolTable;
    private scopeStack: SymbolTable[];

    constructor(programAST: ProgramAST) {
        this.globalScope = cloneDeep(programAST.symbols);
        this.scopeStack = [];
    }

    executeProgram() {
        const mainFuncSymbol: SymbolFunction = this.globalScope.lookupSymbolName('main') as SymbolFunction;
        const mainFuncDeclAST: FuncDeclAST = mainFuncSymbol.funcDeclNode as FuncDeclAST
        
        mainFuncDeclAST.acceptInterpretElement(this);
    }

    interpretFuncDecl(funcDeclAST: FuncDeclAST) {
        this.scopeStack.push(cloneDeep(funcDeclAST.symbols));

        funcDeclAST.body.acceptInterpretElement(this);

        const updatedFuncDeclScope: SymbolTable = this.scopeStack.pop() as SymbolTable;
    }

    interpretBlock(blockAST: BlockAST) {
        this.scopeStack.push(cloneDeep(blockAST.symbols));

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                returnStmtAST.acceptInterpretElement(this);
            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptInterpretElement(this);
            }
        })
        
        const updatedFuncDeclScope: SymbolTable = this.scopeStack.pop() as SymbolTable;
    }

    interpretReturnStmtAST(returnStmtAST: ReturnStmtAST) {
        console.log();
    }

    interpretExpr(exprAST: ExprAST) {
        if (exprAST.type === NodeType.BINARYOP) {
            const binaryExprAST: BinaryExprAST = exprAST as BinaryExprAST;
            binaryExprAST.acceptInterpretElement(this);
        } else if (exprAST.type === NodeType.UNARYOP) {
            const unaryExprAST: UnaryExprAST = exprAST as UnaryExprAST;
            unaryExprAST.acceptInterpretElement(this);

        } else if (exprAST.type === NodeType.FUNCCALL) {
            const funcCallAST: FuncCallAST = exprAST as FuncCallAST;
            funcCallAST.acceptInterpretElement(this);

        } else if (exprAST.type === NodeType.LOCATION) {
            const locAST: LocAST = exprAST as LocAST;
            locAST.acceptInterpretElement(this);
        }
    }

    interpretFuncCall(funcCallAST: FuncCallAST) {
        if (funcCallAST.name === 'print_int' || funcCallAST.name === 'print_bool' || funcCallAST.name === 'print_str') {
            this.interpretIOFuncCalls(funcCallAST);
        } else {
            const funcDeclSymbol: SymbolFunction = this.globalScope.lookupSymbolName(funcCallAST.name) as SymbolFunction;

            const funcDeclAST: FuncDeclAST = funcDeclSymbol.funcDeclNode as FuncDeclAST;
            const funcDeclScope: Map<string, Symbol> = funcDeclAST.symbols.table;

            const argNames: string[] = Array.from(funcDeclScope.keys());
            const funcCallArgs: ExprAST[] = funcCallAST.funcArguments;

            //Evaluate the expressions and place them into the function declaration's scope for parameters.
            for (let i = 0; i < funcCallArgs.length; i++) {
                const currArgName: string = argNames[i];
                funcCallArgs[i].acceptInterpretElement(this);

                const argSymbolValue: SymbolScalar = funcDeclScope.get(currArgName) as SymbolScalar;
                argSymbolValue.value = funcCallArgs[i].value;
            }
            
            funcDeclAST.acceptInterpretElement(this);
        }
    }

    interpretBinaryExpr(binaryExprAST: BinaryExprAST) {

    }

    interpretUnaryExpr(unaryExprAST: UnaryExprAST) {

    }

    interpretLoc(locAST: LocAST) {

    }

    
    private interpretIOFuncCalls(funcCallAST: FuncCallAST) {

    }

    private synchronizeGlobalScope(updatedScope: SymbolTable) {
        if (this.scopeStack.length === 0) {

        } else {
            const currScope: SymbolTable = this.scopeStack[this.scopeStack.length - 1];
        }
    }
}