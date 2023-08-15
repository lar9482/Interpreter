import ProgramAST from "../AST/ProgramAST";
import FuncDeclAST from "../AST/FuncDeclAST";
import BlockAST from "../AST/BlockAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import LocAST from "../AST/ExprAST/LocAST";
import AST from "../AST/AST";

import checkVisitorInterface from "./CheckVisitorInterface";

import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";
import { NodeType } from "../AST/NodeType";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";
import ExprAST from "../AST/ExprAST/ExprAST";
import { DecafType } from "../AST/DecafType";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { BinaryOpType } from "../AST/ExprAST/ExprTypes/BinaryOpType";
import { UnaryOpType } from "../AST/ExprAST/ExprTypes/UnaryOpType";
import SymbolFunction from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolFunction";
import { SymbolType } from "../SymbolTableAnalysis/SymbolTable/Symbol/SymbolType";

/**
 * As part of the second pass for type checking, this visitor will make post-order
 * traversals over statements and expressions to actually check the types.
 * 
 * Base Nodes:
 *      For these traversals, the symbol table is loaded onto the stack for scoping reference later.
 * 
 * Stmt Nodes and Expr Nodes:
 *      Postorder traversals are made to the children of these nodes. 
 *      Then, the specified type checking is applied to these nodes.
 */
export default class TypeCheckVisitor implements checkVisitorInterface {
    private symbolTableStack: SymbolTable[] = [];
    private errorMessages: ErrorMessage[] = [];

    checkTypes(programAST: ProgramAST) {
        programAST.acceptCheckElement(this);
    }

    //Base nodes for the visitor
    checkProgram(programAST: ProgramAST) {
        this.symbolTableStack.push(programAST.symbols);

        programAST.functions.forEach((functionAST: FuncDeclAST) => {
            functionAST.acceptCheckElement(this);
        });

        this.symbolTableStack.pop();
    }

    checkFuncDecl(funcDeclAST: FuncDeclAST) {
        this.symbolTableStack.push(funcDeclAST.symbols);

        funcDeclAST.body.acceptCheckElement(this);

        this.symbolTableStack.pop();
    }

    checkBlock(blockAST: BlockAST) {
        this.symbolTableStack.push(blockAST.symbols);

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.CONDITIONAL) {
                const conditionalStmtAST: ConditionalStmtAST = stmtAST as ConditionalStmtAST;
                conditionalStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.ASSIGNMENT) {
                const assignStmtAST: AssignStmtAST = stmtAST as AssignStmtAST;
                assignStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.WHILELOOP) {
                const whileLoopStmtAST: WhileLoopStmtAST = stmtAST as WhileLoopStmtAST;
                whileLoopStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                returnStmtAST.acceptCheckElement(this);

            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptCheckElement(this);
            }
        });

        this.symbolTableStack.pop();
    }

    //Stmts that need to be type checked.
    checkConditionalStmt(conditionalStmtAST: ConditionalStmtAST) {

        conditionalStmtAST.ifBlock.acceptCheckElement(this);
        conditionalStmtAST.elseBlock?.acceptCheckElement(this);
        conditionalStmtAST.condition.acceptCheckElement(this);

        if (conditionalStmtAST.condition.decafType === DecafType.BOOL) {
            return;
        } else {
            this.errorMessages.push(
                new ErrorMessage(`Line ${conditionalStmtAST.sourceLineNumber}: The conditional in the if statement is not a boolean type.`)
            );

            return;
        }
    }

    checkAssignSmt(assignStmtAST: AssignStmtAST) {
        assignStmtAST.location.acceptCheckElement(this);
        assignStmtAST.value.acceptCheckElement(this);

        const currAssignSymbol: Symbol = this.getSymbolFromCurrentTable(assignStmtAST.location.name, assignStmtAST.sourceLineNumber);

        if (assignStmtAST.value.decafType !== currAssignSymbol.returnType) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${assignStmtAST.sourceLineNumber}: The location type does not match with the assignment expression`)
            );
        }

        if (assignStmtAST.location.index !== undefined) {
            if (assignStmtAST.location.index.decafType !== DecafType.INT) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${assignStmtAST.sourceLineNumber}: The index expression not an integer.`)
                );
            }
        }
    }

    checkWhileStmt(whileLoopStmtAST: WhileLoopStmtAST) {
        whileLoopStmtAST.condition.acceptCheckElement(this);
        whileLoopStmtAST.body.acceptCheckElement(this);

        if (whileLoopStmtAST.condition.decafType !== DecafType.BOOL) {
            this.errorMessages.push(
                new ErrorMessage(`Line ${whileLoopStmtAST.sourceLineNumber}: The conditional for the while loop is not a boolean type.`)
            );
        }
    }

    checkReturnStmt(returnStmtAST: ReturnStmtAST) {
        returnStmtAST.returnValue?.acceptCheckElement(this);

        const globalTable: SymbolTable = this.getParentTableFromCurrentTable(
            NodeType.PROGRAM, this.symbolTableStack[this.symbolTableStack.length - 1]
        ) as SymbolTable;

        const currFunctionScopeTable: SymbolTable = this.getParentTableFromCurrentTable(
            NodeType.FUNCDECL, this.symbolTableStack[this.symbolTableStack.length - 1]
        ) as SymbolTable;

        const currFunctionName: string = currFunctionScopeTable.scopeName as string;

        if (globalTable !== undefined && currFunctionScopeTable !== undefined && currFunctionName !== undefined) {

            const currFunctionSymbol: Symbol = globalTable.lookupSymbolName(currFunctionName) as Symbol;

            if (currFunctionSymbol.returnType !== returnStmtAST.returnValue?.decafType) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${returnStmtAST.sourceLineNumber}: Return expression doesn't match the function return type`)
                );
            }
        } else {
            this.errorMessages.push(
                new ErrorMessage(`Line ${returnStmtAST.sourceLineNumber}: Unable to type check return statement.`)
            );
        }
    }

    checkExpr(exprAST: ExprAST) {
        if (exprAST.type === NodeType.BINARYOP) {
            const binaryExprAST: BinaryExprAST = exprAST as BinaryExprAST;
            binaryExprAST.acceptCheckElement(this);

        } else if (exprAST.type === NodeType.UNARYOP) {
            const unaryExprAST: UnaryExprAST = exprAST as UnaryExprAST;
            unaryExprAST.acceptCheckElement(this);

        } else if (exprAST.type === NodeType.FUNCCALL) {
            const funcCallExprAST: FuncCallAST = exprAST as FuncCallAST;
            funcCallExprAST.acceptCheckElement(this);

        } else if (exprAST.type === NodeType.LOCATION) {
            const locExprAST: LocAST = exprAST as LocAST;
            locExprAST.acceptCheckElement(this);
        }
    }

    //Exprs that need to be type checked.
    checkBinaryExpr(binaryExprAST: BinaryExprAST) {
        binaryExprAST.left.acceptCheckElement(this);
        binaryExprAST.right.acceptCheckElement(this);

        if (binaryExprAST.operator === BinaryOpType.ADDOP ||
            binaryExprAST.operator === BinaryOpType.SUBOP ||
            binaryExprAST.operator === BinaryOpType.MULOP ||
            binaryExprAST.operator === BinaryOpType.DIVOP ||
            binaryExprAST.operator === BinaryOpType.MODOP ||
            binaryExprAST.operator === BinaryOpType.LTOP ||
            binaryExprAST.operator === BinaryOpType.LEOP ||
            binaryExprAST.operator === BinaryOpType.GTOP ||
            binaryExprAST.operator === BinaryOpType.GEOP) {

            if (binaryExprAST.left.decafType !== DecafType.INT) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${binaryExprAST.sourceLineNumber}: Left side of the expression is not an integer`)
                );
            }

            if (binaryExprAST.right.decafType !== DecafType.INT) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${binaryExprAST.sourceLineNumber}: Right side of the expression is not an integer`)
                );
            }

        } else if (binaryExprAST.operator === BinaryOpType.EQOP) {
            if (binaryExprAST.left.decafType !== binaryExprAST.right.decafType) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${binaryExprAST.sourceLineNumber}: Within the equality expression, the types of the binary expression do not match.`)
                );
            }

        } else if (binaryExprAST.operator === BinaryOpType.ANDOP ||
            binaryExprAST.operator === BinaryOpType.OROP) {

            if (binaryExprAST.left.decafType !== DecafType.BOOL) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${binaryExprAST.sourceLineNumber}: Left side of the expression is not a boolean`)
                );
            }

            if (binaryExprAST.right.decafType !== DecafType.BOOL) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${binaryExprAST.sourceLineNumber}: Right side of the expression is not a boolean`)
                );
            }
        }
    }

    checkUnaryExpr(unaryExprAST: UnaryExprAST) {
        unaryExprAST.child.acceptCheckElement(this);
        
        if (unaryExprAST.operator === UnaryOpType.NEGOP) {
            if (unaryExprAST.child.decafType !== DecafType.INT) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${unaryExprAST.sourceLineNumber}: The child expression is not an integer.`)
                );
            }
        } else if (unaryExprAST.operator === UnaryOpType.NOTOP) {
            if (unaryExprAST.child.decafType !== DecafType.BOOL) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${unaryExprAST.sourceLineNumber}: The child expression is not a boolean.`)
                );
            }
        }
    }

    checkFuncCall(funcCallAST: FuncCallAST) {
        funcCallAST.funcArguments.forEach((argExprAST: ExprAST) => {
            argExprAST.acceptCheckElement(this);
        });

        const globalScopeSymbolTable: SymbolTable = this.getParentTableFromCurrentTable(
            NodeType.PROGRAM, this.symbolTableStack[this.symbolTableStack.length - 1]
        ) as SymbolTable;
        const symbol: Symbol = globalScopeSymbolTable.lookupSymbolName(funcCallAST.name) as Symbol;

        if (symbol !== undefined && symbol.symbolType === SymbolType.FUNCTION_SYMBOL) {
            const funcCallSymbol: SymbolFunction = symbol as SymbolFunction;

            if (funcCallSymbol.returnType !== funcCallAST.decafType) {
                this.errorMessages.push(
                    new ErrorMessage(
                    `Line ${funcCallAST.sourceLineNumber}: The function call doesn't match with the declaration of ${funcCallSymbol.name}, which is ${funcCallSymbol.returnType}.`
                    )
                );
            }

            if (funcCallSymbol.parameters.length !== funcCallAST.funcArguments.length) {
                this.errorMessages.push(
                    new ErrorMessage(
                    `Line ${funcCallAST.sourceLineNumber}: The number of arguments inside the function doesn't match the number of parameters in ${funcCallSymbol.name}'s declaration.`
                    )
                );
            }

            for (let i = 0; i < funcCallSymbol.parameters.length; i++) {
                if (funcCallSymbol.parameters[i].parameterType !== funcCallAST.funcArguments[i].decafType) {
                    this.errorMessages.push(
                        new ErrorMessage(
                        `Line ${funcCallAST.sourceLineNumber}: ${funcCallSymbol.parameters[i].name}'s type, ${funcCallSymbol.parameters[i].parameterType}, doesn't match with the passed in argument`
                        )
                    );
                }
            }

        } else {
            this.errorMessages.push(
                new ErrorMessage(`Line ${funcCallAST.sourceLineNumber}: Unable to locate the function call ${funcCallAST.name}.`)
            );
        }
        
    }

    checkLoc(locAST: LocAST) {
        if (locAST.index) {
            if (locAST.index.decafType !== DecafType.INT) {
                this.errorMessages.push(
                    new ErrorMessage(`Line ${locAST.sourceLineNumber}: The index expression is not an integer.`)
                );
            }
        }
    }

    private getSymbolFromCurrentTable(symbolName: string, lineNumber: number) {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length - 1];
        const symbol: Symbol | undefined = currentSymbolTable.lookupSymbolName(symbolName);

        if (symbol !== undefined) {
            return symbol as Symbol;
        } else {
            throw new Error(`Line ${lineNumber}: The symbol '${symbolName}' is undefined in the current context. Unable to check its type`);
        }
    }

    private getParentTableFromCurrentTable(parentScopeType: NodeType, symbolTable: SymbolTable) {
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