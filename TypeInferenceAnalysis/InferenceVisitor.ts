import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import BlockAST from "../AST/BlockAST";
import ConditionalStmtAST from "../AST/StmtAST/ConditionalStmtAST";
import WhileLoopStmtAST from "../AST/StmtAST/WhileLoopStmtAST";
import AssignStmtAST from "../AST/StmtAST/AssignStmtAST";
import BinaryExprAST from "../AST/ExprAST/BinaryExprAST";
import UnaryExprAST from "../AST/ExprAST/UnaryExprAST";
import FuncCallAST from "../AST/ExprAST/FuncCallAST";
import LocAST from "../AST/ExprAST/LocAST";
import AST from "../AST/AST";
import ExprAST from "../AST/ExprAST/ExprAST";

import inferenceVisitorInterface from "./InferenceVisitorInterface";
import SymbolTable from "../SymbolTableAnalysis/SymbolTable/SymbolTable";
import { NodeType } from "../AST/NodeType";
import { BinaryOpType } from "../AST/ExprAST/ExprTypes/BinaryOpType";

import { DecafType } from "../AST/DecafType";
import { UnaryOpType } from "../AST/ExprAST/ExprTypes/UnaryOpType";
import Symbol from "../SymbolTableAnalysis/SymbolTable/Symbol/Symbol";
import ReturnStmtAST from "../AST/StmtAST/ReturnStmtAST";

/**
 * As part of the first pass for type checking, this visitor will make pre-order
 * traversals to the expression nodes to infer their types.
 * 
 * Most of the types are either inferred from:
 *  1. Their operator.
 *  2. The type from the symbol table.
 *
 */
export default class TypeInferenceVisitor implements inferenceVisitorInterface {

    private symbolTableStack: SymbolTable[] = [];
    public errorMessages: string[] = [];

    inferTypes(programAST: ProgramAST) {
        programAST.acceptInferenceElement(this);
    }

    //Base nodes for the visitor.
    inferProgram(programAST: ProgramAST) {
        this.symbolTableStack.push(programAST.symbols);

        programAST.functions.forEach((functionAST: FuncDeclAST) => {
            functionAST.acceptInferenceElement(this);
        })

        this.symbolTableStack.pop();
    }

    inferFuncDecl(funcDeclAST: FuncDeclAST) {
        this.symbolTableStack.push(funcDeclAST.symbols);

        funcDeclAST.body.acceptInferenceElement(this);

        this.symbolTableStack.pop();
    }

    inferBlock(blockAST: BlockAST) {
        this.symbolTableStack.push(blockAST.symbols);

        blockAST.statements.forEach((stmtAST: AST) => {
            if (stmtAST.type === NodeType.CONDITIONAL) {
                const conditionStmtAST: ConditionalStmtAST = stmtAST as ConditionalStmtAST;
                conditionStmtAST.acceptInferenceElement(this);

            } else if (stmtAST.type === NodeType.WHILELOOP) {
                const whileLoopStmtAST: WhileLoopStmtAST = stmtAST as WhileLoopStmtAST;
                whileLoopStmtAST.acceptInferenceElement(this);

            } else if (stmtAST.type === NodeType.ASSIGNMENT) {
                const assignStmtAST: AssignStmtAST = stmtAST as AssignStmtAST;
                assignStmtAST.acceptInferenceElement(this);

            } else if (stmtAST.type === NodeType.RETURNSTMT) {
                const returnStmtAST: ReturnStmtAST = stmtAST as ReturnStmtAST;
                returnStmtAST.acceptInferenceElement(this);
            } else if (stmtAST.type === NodeType.FUNCCALL) {
                const funcCallAST: FuncCallAST = stmtAST as FuncCallAST;
                funcCallAST.acceptInferenceElement(this);
            }
        })

        this.symbolTableStack.pop();
    }

    //Containers for the expressions that need inference.
    inferConditionalStmt(conditionalStmtAST: ConditionalStmtAST) {
        conditionalStmtAST.condition.acceptInferenceElement(this);
        conditionalStmtAST.ifBlock.acceptInferenceElement(this);
        
        if (conditionalStmtAST.elseBlock) {
            conditionalStmtAST.elseBlock.acceptInferenceElement(this);
        }
    }

    inferWhileStmt(whileStmtAST: WhileLoopStmtAST) {
        whileStmtAST.condition.acceptInferenceElement(this);
        whileStmtAST.body.acceptInferenceElement(this);
    }

    inferAssignStmt(assignStmtAST: AssignStmtAST) {
        assignStmtAST.location.acceptInferenceElement(this);
        assignStmtAST.value.acceptInferenceElement(this);
    }

    inferReturnStmt(returnStmtAST: ReturnStmtAST) {
        if (returnStmtAST.returnValue) {
            const returnExpr: ExprAST = returnStmtAST.returnValue;
            returnExpr.acceptInferenceElement(this);
        }
    }

    inferExpr(exprAST: ExprAST) {
        if (exprAST.type === NodeType.BINARYOP) {
            const binaryExprAST: BinaryExprAST = exprAST as BinaryExprAST;
            binaryExprAST.acceptInferenceElement(this);
        } else if (exprAST.type === NodeType.UNARYOP) {
            const unaryExprAST: UnaryExprAST = exprAST as UnaryExprAST;
            unaryExprAST.acceptInferenceElement(this);

        } else if (exprAST.type === NodeType.FUNCCALL) {
            const funcCallAST: FuncCallAST = exprAST as FuncCallAST;
            funcCallAST.acceptInferenceElement(this);

        } else if (exprAST.type === NodeType.LOCATION) {
            const locAST: LocAST = exprAST as LocAST;
            locAST.acceptInferenceElement(this);

        }
    }
   
    //The 'atomic' expressions that require inferences.
    inferBinaryExpr(binaryExprAST: BinaryExprAST) {
        if (binaryExprAST.operator === BinaryOpType.LTOP ||
            binaryExprAST.operator === BinaryOpType.LEOP ||
            binaryExprAST.operator === BinaryOpType.GTOP ||
            binaryExprAST.operator === BinaryOpType.GEOP || 
            binaryExprAST.operator === BinaryOpType.EQOP ||
            binaryExprAST.operator === BinaryOpType.NEQOP ||
            binaryExprAST.operator === BinaryOpType.ANDOP ||
            binaryExprAST.operator === BinaryOpType.OROP) {
            
            binaryExprAST.decafType = DecafType.BOOL;
        } else if (
            binaryExprAST.operator === BinaryOpType.ADDOP ||
            binaryExprAST.operator === BinaryOpType.SUBOP ||
            binaryExprAST.operator === BinaryOpType.MULOP ||
            binaryExprAST.operator === BinaryOpType.DIVOP ||
            binaryExprAST.operator === BinaryOpType.MODOP
        ){
            binaryExprAST.decafType = DecafType.INT;
        }
        else {
            this.errorMessages.push(
                `Line ${binaryExprAST.sourceLineNumber}: Unable to infer the type of ${binaryExprAST.operator}`
            );
        }

        binaryExprAST.left.acceptInferenceElement(this);
        binaryExprAST.right.acceptInferenceElement(this);
    }

    inferUnaryExpr(unaryExprAST: UnaryExprAST) {
        if (unaryExprAST.operator === UnaryOpType.NEGOP) {
            unaryExprAST.decafType = DecafType.INT;
        } else if (unaryExprAST.operator === UnaryOpType.NOTOP) {
            unaryExprAST.decafType = DecafType.BOOL;
        } else {
            this.errorMessages.push(
                `Line ${unaryExprAST.sourceLineNumber}: Unable to infer the type of ${unaryExprAST.operator}`
            );
        }

        unaryExprAST.child.acceptInferenceElement(this);
    }

    inferFuncCall(funcCallAST: FuncCallAST) {
        const funcCallSymbol: Symbol = this.getSymbolFromCurrentTable(funcCallAST.name, funcCallAST.sourceLineNumber) as Symbol;
        funcCallAST.decafType = funcCallSymbol.returnType;
        
        funcCallAST.funcArguments.forEach((exprArgAST: ExprAST) => {
            exprArgAST.acceptInferenceElement(this);
        }) 
    }

    inferLoc(locAST: LocAST) {
        const locSymbol: Symbol = this.getSymbolFromCurrentTable(locAST.name, locAST.sourceLineNumber) as Symbol;
        locAST.decafType = locSymbol.returnType;

        locAST.index?.acceptInferenceElement(this);
    }

    private getSymbolFromCurrentTable(symbolName: string, lineNumber: number) {
        const currentSymbolTable: SymbolTable = this.symbolTableStack[this.symbolTableStack.length-1];
        const symbol: Symbol | undefined = currentSymbolTable.lookupSymbolName(symbolName);

        if (symbol !== undefined) {
            return symbol as Symbol;
        } else {
            throw new Error(`Line ${lineNumber}: The symbol '${symbolName}' is undefined in the current context. Unable to infer its type`);
        }
    }
}