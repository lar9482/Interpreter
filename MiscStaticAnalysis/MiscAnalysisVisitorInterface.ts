import ProgramAST from "../AST/ProgramAST";
import VarDeclAST from "../AST/VarDeclAST";

export default interface miscAnalysisVisitorInterface {
    //Base nodes for the visitor.
    analyzeProgram: (programAST: ProgramAST) => void,
    analyzeVarDecl: (varDeclAST: VarDeclAST) => void
}