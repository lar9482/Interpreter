import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";
import VarDeclAST from "../AST/VarDeclAST";
import ParameterAST from "../AST/ParameterAST";
import StmtAST from "../AST/StmtAST/StmtAST";

import Symbol from "./SymbolTable/Symbol/Symbol";
import SymbolFunction from "./SymbolTable/Symbol/SymbolFunction";
import SymbolTable from "./SymbolTable/SymbolTable";
import SymbolArray from "./SymbolTable/Symbol/SymbolArray";
import { SymbolType } from "./SymbolTable/Symbol/SymbolType";
import symbolVisitorInterface from "./symbolVisitorInterface";

import { DecafType } from "../AST/DecafType";
import { NodeType } from "../AST/NodeType";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SymbolScalar from "./SymbolTable/Symbol/SymbolScalar";

/**
 * This visitor will build symbol tables by traversing down to variable declarations and parameters,
 * and caching symbols into tables that are stored in the program, function declaration, and block AST nodes.
 * 
 * For now, the only nodes that are classified as 'symbols' are nodes that contain idenifiers.
 * This includes VarDeclASTs, FuncDeclASTs, and ParameterASTs.
 * 
 * NOTE:
 * print_int, print_str, and print_bool will be hard coded into the 'ProgramAST' symbol for I/O support
 */
export default class SymbolVisitor implements symbolVisitorInterface {

    private symbolTableStack: SymbolTable[] = [];
    public errorMessages: string[] = [];

    buildSymbolTables(programAST: ProgramAST) {
        programAST.acceptSymbolScope(this, NodeType.PROGRAM);
    }

    private initializeIOIntoGlobalScope(globalScopeSymbolTable: SymbolTable) {
        const printStrSymbol: SymbolFunction = new SymbolFunction(
            SymbolType.FUNCTION_SYMBOL,
            "print_str",
            -1,
            DecafType.VOID,
            [new ParameterAST(
                NodeType.PARAMETER,
                -1,
                "print_str",
                DecafType.STR
            )]
        );

        const printIntSymbol: SymbolFunction = new SymbolFunction(
            SymbolType.FUNCTION_SYMBOL,
            "print_int",
            -1,
            DecafType.VOID,
            [new ParameterAST(
                NodeType.PARAMETER,
                -1,
                "print_int",
                DecafType.INT
            )]
        );

        const printBoolSymbol: SymbolFunction = new SymbolFunction(
            SymbolType.FUNCTION_SYMBOL,
            "print_bool",
            -1,
            DecafType.VOID,
            [new ParameterAST(
                NodeType.PARAMETER,
                -1,
                "print_bool",
                DecafType.BOOL
            )]
        );

        globalScopeSymbolTable.addSymbol(printStrSymbol);
        globalScopeSymbolTable.addSymbol(printIntSymbol);
        globalScopeSymbolTable.addSymbol(printBoolSymbol);
    }

    visitProgram(programAST: ProgramAST, containerType: NodeType) { 
        const globalScopeSymbolTable: SymbolTable = new SymbolTable(programAST.type, containerType);
        this.initializeIOIntoGlobalScope(globalScopeSymbolTable);

        this.symbolTableStack.push(globalScopeSymbolTable);

        programAST.variables.forEach((variableAST: VarDeclAST) => {
            variableAST.acceptSymbolElement(this);
        })

        programAST.functions.forEach((functionDeclAST: FuncDeclAST) => {
            functionDeclAST.acceptSymbolScope(this, programAST.type)
        })

        programAST.addSymbolTable(globalScopeSymbolTable);
        this.symbolTableStack.pop();
    }

    visitFuncDecl(funcDeclAST: FuncDeclAST, containerType: NodeType) {
        
        const functionNameSymbol: SymbolFunction = new SymbolFunction(
            SymbolType.FUNCTION_SYMBOL,
            funcDeclAST.name,
            funcDeclAST.sourceLineNumber,
            funcDeclAST.returnType,
            funcDeclAST.parameters,
            funcDeclAST
        );
        this.addSymbolToCurrentSymbolTable(functionNameSymbol, funcDeclAST.sourceLineNumber);

        const functionDeclScopeSymbolTable: SymbolTable = new SymbolTable(
            funcDeclAST.type, 
            containerType,
            this.symbolTableStack[this.symbolTableStack.length-1], 
            funcDeclAST.name
        );
        this.symbolTableStack.push(functionDeclScopeSymbolTable);

        funcDeclAST.parameters.forEach((parameter: ParameterAST) => {
            parameter.acceptSymbolElement(this);
        })
        funcDeclAST.body.acceptSymbolScope(this, funcDeclAST.type);
        
        funcDeclAST.addSymbolTable(functionDeclScopeSymbolTable);
        this.symbolTableStack.pop();
    }

    visitBlock(blockAST: BlockAST, containerType: NodeType) {
        const blockScopeSymbolTable: SymbolTable = new SymbolTable(
            NodeType.BLOCK, 
            containerType,
            this.symbolTableStack[this.symbolTableStack.length-1]
        );

        this.symbolTableStack.push(blockScopeSymbolTable);

        blockAST.variables.forEach((variableAST: VarDeclAST) => {
            variableAST.acceptSymbolElement(this);
        }) 

        blockAST.statements.forEach((stmtAST: StmtAST) => {
            if (stmtAST.type === NodeType.CONDITIONAL) {
                const conditionStmt: ConditionalStmtAST = stmtAST as ConditionalStmtAST;
                conditionStmt.ifBlock.acceptSymbolScope(this, NodeType.CONDITIONAL);

                if (conditionStmt.elseBlock) {
                    conditionStmt.elseBlock.acceptSymbolScope(this, NodeType.CONDITIONAL);
                }
            }
            else if (stmtAST.type === NodeType.WHILELOOP) {
                const whileLoopStmt: WhileLoopStmtAST = stmtAST as WhileLoopStmtAST;
                whileLoopStmt.body.acceptSymbolScope(this, NodeType.WHILELOOP);
            }
        })

        blockAST.addSymbolTable(blockScopeSymbolTable);
        this.symbolTableStack.pop();
    }

    visitVarDec(varDeclAST: VarDeclAST) {
        if (varDeclAST.isArray) {
            const newSymbolArray: SymbolArray = new SymbolArray(
                SymbolType.ARRAY_SYMBOL,
                varDeclAST.name,
                varDeclAST.sourceLineNumber,
                varDeclAST.decafType,
                varDeclAST.arrayLength,
                varDeclAST
            );
            
            this.addSymbolToCurrentSymbolTable(newSymbolArray, varDeclAST.sourceLineNumber)
        }

        else {
            const newSymbolScalar: SymbolScalar = new SymbolScalar(
                SymbolType.SCALAR_SYMBOL,
                varDeclAST.name,
                varDeclAST.sourceLineNumber,
                varDeclAST.decafType,
                varDeclAST
            );
            
            this.addSymbolToCurrentSymbolTable(newSymbolScalar, varDeclAST.sourceLineNumber);
        }
    }

    visitParameter(parameterAST: ParameterAST) {
        const parameterSymbol: Symbol = new SymbolScalar(
            SymbolType.SCALAR_SYMBOL,
            parameterAST.name,
            parameterAST.sourceLineNumber,
            parameterAST.parameterType,
            parameterAST
        );

        this.addSymbolToCurrentSymbolTable(parameterSymbol, parameterAST.sourceLineNumber);
    }

    private addSymbolToCurrentSymbolTable(symbol: Symbol, sourceLineNumber: number) {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length-1];

        if (currentSymbolTable.lookupSymbolName(symbol.name)) {
            this.errorMessages.push(
                `Line ${sourceLineNumber}: Symbol ${symbol.name} appears more than once.`
            );
        } else {
            currentSymbolTable.addSymbol(symbol);
        }
    }
}