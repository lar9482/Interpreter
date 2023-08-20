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
import { BinaryOpType } from "../AST/ExprAST/ExprTypes/BinaryOpType";
import { UnaryOpType } from "../AST/ExprAST/ExprTypes/UnaryOpType";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import SymbolArray from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolArray";
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
        this.synchronizeGlobalScope(updatedFuncDeclScope);
    }

    interpretBlock(blockAST: BlockAST) {
        this.scopeStack.push(cloneDeep(blockAST.symbols));

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.ASSIGNMENT){
                const assignStmtAST: AssignStmtAST = stmtAST as AssignStmtAST;
                assignStmtAST.acceptInterpretElement(this);

            } else if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                returnStmtAST.acceptInterpretElement(this);
                
            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptInterpretElement(this);
            }
        })
        
        const updatedFuncDeclScope: SymbolTable = this.scopeStack.pop() as SymbolTable;
        this.synchronizeGlobalScope(updatedFuncDeclScope);
    }

    interpretAssignStmtAST(assignStmtAST: AssignStmtAST) {
        assignStmtAST.value.acceptInterpretElement(this);
        
        if (assignStmtAST.location.index) {
            assignStmtAST.location.index.acceptInterpretElement(this);
            
            const symbolToAssign: SymbolArray = this.getSymbolFromCurrentScope(assignStmtAST.location.name) as SymbolArray;
            const indexValue: number = assignStmtAST.location.index.value as number;

            symbolToAssign.value[indexValue] = assignStmtAST.value.value as number | boolean;
        } else {
            const symbolToAssign: SymbolScalar = this.getSymbolFromCurrentScope(assignStmtAST.location.name) as SymbolScalar;

            symbolToAssign.value = assignStmtAST.value.value as number | boolean;
        }

        console.log();
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

            //Evaluate the expressions and place them into the function declaration's scope 
            //as evaluation for the passed in parameters.
            for (let i = 0; i < funcCallArgs.length; i++) {
                funcCallArgs[i].acceptInterpretElement(this);

                const currArgName: string = argNames[i];
                const argSymbolValue: Symbol = funcDeclScope.get(currArgName) as Symbol;

                argSymbolValue.value = funcCallArgs[i].value;
            }
            
            funcDeclAST.acceptInterpretElement(this);
        }
    }

    interpretBinaryExpr(binaryExprAST: BinaryExprAST) {
        binaryExprAST.left.acceptInterpretElement(this);
        binaryExprAST.right.acceptInterpretElement(this);
        
        switch(binaryExprAST.operator) {
            case BinaryOpType.ADDOP:
                binaryExprAST.value = (binaryExprAST.left.value as number) + (binaryExprAST.right.value as number);
                break;
            case BinaryOpType.SUBOP:
                binaryExprAST.value = (binaryExprAST.left.value as number) - (binaryExprAST.right.value as number);
                break;
            case BinaryOpType.MULOP:
                binaryExprAST.value = (binaryExprAST.left.value as number) * (binaryExprAST.right.value as number);
                break;
            case BinaryOpType.DIVOP:
                binaryExprAST.value = (binaryExprAST.left.value as number) / (binaryExprAST.right.value as number);
                break;
            case BinaryOpType.MODOP:
                binaryExprAST.value = (binaryExprAST.left.value as number) % (binaryExprAST.right.value as number);
                break;
            case BinaryOpType.ANDOP:
                binaryExprAST.value = (binaryExprAST.left.value as boolean) && (binaryExprAST.right.value as boolean);
                break;
            case BinaryOpType.OROP:
                binaryExprAST.value = (binaryExprAST.left.value as boolean) || (binaryExprAST.right.value as boolean);
                break;
            case BinaryOpType.LEOP:
                binaryExprAST.value = (binaryExprAST.left.value as boolean) <= (binaryExprAST.right.value as boolean);
                break;
            case BinaryOpType.LTOP:
                binaryExprAST.value = (binaryExprAST.left.value as boolean) < (binaryExprAST.right.value as boolean);
                break;
            case BinaryOpType.GEOP:
                binaryExprAST.value = (binaryExprAST.left.value as boolean) >= (binaryExprAST.right.value as boolean);
                break;
            case BinaryOpType.GTOP:
                binaryExprAST.value = (binaryExprAST.left.value as boolean) > (binaryExprAST.right.value as boolean);
                break;
            case BinaryOpType.EQOP:
                binaryExprAST.value = (binaryExprAST.left.value) == (binaryExprAST.right.value);
                break;
            case BinaryOpType.NEQOP:
                binaryExprAST.value = (binaryExprAST.left.value) != (binaryExprAST.right.value);
                break;
            default:
                throw new Error('Unable to execute binary operation.');
        }
    }

    interpretUnaryExpr(unaryExprAST: UnaryExprAST) {
        unaryExprAST.child.acceptInterpretElement(this);

        switch (unaryExprAST.operator) {
            case UnaryOpType.NEGOP: 
                unaryExprAST.value = -(unaryExprAST.child.value as number);
                break;
            case UnaryOpType.NOTOP:
                unaryExprAST.value = !(unaryExprAST.child.value as boolean);
        }
    }

    interpretLoc(locAST: LocAST) {
        
    }

    
    private interpretIOFuncCalls(funcCallAST: FuncCallAST) {

    }

    private synchronizeGlobalScope(updatedScope: SymbolTable) {
        this.globalScope.synchronizeRootTable(updatedScope);

        this.scopeStack.forEach((scope: SymbolTable) => {
            scope.synchronizeRootTable(this.globalScope);
        }) 
    }

    private getSymbolFromCurrentScope(symbolName: string): Symbol {
        const currentSymbolTable: SymbolTable = this.scopeStack[this.scopeStack.length - 1];
        const symbol: Symbol = currentSymbolTable.lookupSymbolName(symbolName) as Symbol;

        return symbol;
    }
}