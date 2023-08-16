import FuncDeclAST from "../AST/FuncDeclAST";
import ProgramAST from "../AST/ProgramAST";
import ParameterAST from "../AST/ParameterAST";

export default interface miscAnalysisVisitorInterface {
    //Base nodes for the visitor.
    analyzeProgram: (programAST: ProgramAST) => void,
    analyzeFuncDecl: (funcDeclAST: FuncDeclAST) => void
}