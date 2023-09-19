import { cloneDeep } from "lodash";

import interpretVisitorInterface from "./InterpretVisitorInterface";
import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";

import SymbolFunction from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolFunction";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";

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
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";

/**
 * NOTE:
 * All of the returned values from functions will be stored in global scope.
 * FOR NOW, THERE IS NO DEEP COPY OF SYMBOL TABLES. THIS MEANS RECURSION WILL DO WORK.
 */
export default class InterpretVisitor implements interpretVisitorInterface{

    private globalScope: SymbolTable;
    private scopeStack: SymbolTable[];

    constructor(programAST: ProgramAST) {
        this.globalScope = programAST.symbols;
        this.scopeStack = [];
    }

    executeProgram() {
        const mainFuncSymbol: SymbolFunction = this.globalScope.lookupSymbolName('main') as SymbolFunction;
        const mainFuncDeclAST: FuncDeclAST = mainFuncSymbol.funcDeclNode as FuncDeclAST
        
        mainFuncDeclAST.acceptInterpretElement(this);
    }

    interpretFuncDecl(funcDeclAST: FuncDeclAST) {
        this.scopeStack.push(funcDeclAST.symbols);

        funcDeclAST.body.acceptInterpretElement(this);

        this.scopeStack.pop() as SymbolTable;
        // const updatedFuncDeclScope: SymbolTable = this.scopeStack.pop() as SymbolTable;
        // this.synchronizeGlobalScope(updatedFuncDeclScope);
    }

    interpretBlock(blockAST: BlockAST) {
        this.scopeStack.push(blockAST.symbols);

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.ASSIGNMENT){
                const assignStmtAST: AssignStmtAST = stmtAST as AssignStmtAST;
                assignStmtAST.acceptInterpretElement(this);

            } else if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                const functionName: string = this.getParentTableFromCurrentTable(
                    NodeType.FUNCDECL, 
                    this.scopeStack[this.scopeStack.length - 1]
                )?.scopeName as string;

                returnStmtAST.acceptInterpretElement(this, functionName);

            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptInterpretElement(this);

            } else if (stmtAST.type === NodeType.CONDITIONAL) {
                const conditionalStmtAST: ConditionalStmtAST = stmtAST as ConditionalStmtAST;
                conditionalStmtAST.acceptInterpretElement(this);

            } else if (stmtAST.type === NodeType.WHILELOOP) {
                const whileLoopStmtAST: WhileLoopStmtAST = stmtAST as WhileLoopStmtAST;
                whileLoopStmtAST.acceptInterpretElement(this);
            }
        })
        
        this.scopeStack.pop() as SymbolTable;
        // const updatedFuncDeclScope: SymbolTable = this.scopeStack.pop() as SymbolTable;
        // this.synchronizeGlobalScope(updatedFuncDeclScope);
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
    }

    interpretReturnStmtAST(returnStmtAST: ReturnStmtAST, functionName: string) {
        const functionSymbol: SymbolFunction = this.getSymbolFromCurrentScope(functionName) as SymbolFunction;

        if (returnStmtAST.returnValue) {
            returnStmtAST.returnValue.acceptInterpretElement(this);
            functionSymbol.value = returnStmtAST.returnValue.value as number | boolean;
        } else {
            functionSymbol.value = undefined;
        }
    }

    interpretConditionalStmtAST(conditionalStmtAST: ConditionalStmtAST) {
        conditionalStmtAST.condition.acceptInterpretElement(this);
        const conditionValue: boolean = conditionalStmtAST.condition.value as boolean;

        if (conditionValue) {
            conditionalStmtAST.ifBlock.acceptInterpretElement(this);
        } else if (conditionalStmtAST.elseBlock) {
            conditionalStmtAST.elseBlock.acceptInterpretElement(this);
        }
    }

    interpretWhileLoopStmtAST(whileLoopStmtAST: WhileLoopStmtAST) {
        whileLoopStmtAST.condition.acceptInterpretElement(this);

        while (whileLoopStmtAST.condition.value as boolean) {
            whileLoopStmtAST.body.acceptInterpretElement(this);
            whileLoopStmtAST.condition.acceptInterpretElement(this);
        }
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

            const funcDeclAST: FuncDeclAST = funcDeclSymbol.funcDeclNode as FuncDeclAST
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
            
            const calledFunctionSymbol: SymbolFunction = this.getSymbolFromCurrentScope(funcCallAST.name) as SymbolFunction;
            funcCallAST.value = calledFunctionSymbol.value as number | boolean;
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
                binaryExprAST.value = Math.ceil((binaryExprAST.left.value as number) / (binaryExprAST.right.value as number));
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
                break;
            default:
                throw new Error('Unable to execute unary operation.');
        }
    }

    interpretLoc(locAST: LocAST) {  
        if (locAST.index) {
            locAST.index.acceptInterpretElement(this);

            const indexValue: number = locAST.index.value as number;
            const symbolToLoadIn: SymbolArray = this.getSymbolFromCurrentScope(locAST.name) as SymbolArray;

            locAST.value = symbolToLoadIn.value[indexValue];
        } else {
            const symbolToLoadIn: SymbolScalar = this.getSymbolFromCurrentScope(locAST.name) as SymbolScalar;
            locAST.value = symbolToLoadIn.value;
        }
    }

    private interpretIOFuncCalls(funcCallAST: FuncCallAST) {
        if (funcCallAST.name === 'print_int' || funcCallAST.name === 'print_bool') {
            funcCallAST.funcArguments[0].acceptInterpretElement(this);
            console.log(funcCallAST.funcArguments[0].value);
        } else {
            console.log((funcCallAST.funcArguments[0].value as string).replace(/^"|"$/g, ''));
        }
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

    private getParentTableFromCurrentTable(parentScopeType: NodeType, symbolTable: SymbolTable): SymbolTable | undefined {
        let currSymbolTable: SymbolTable = symbolTable;

        while (currSymbolTable !== undefined) {
            if (currSymbolTable.scopeType === parentScopeType) {
                return currSymbolTable;
            } else {
                currSymbolTable = currSymbolTable.parentTable as SymbolTable
            }
        }
    }
}