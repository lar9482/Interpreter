The basic structure of the abstract syntax tree. 

* ProgramAST **(contains VarDeclASTs and FuncDeclASTs)**
* VarDeclAST
* FuncDeclAST **(contains BlockAST)**
* BlockAST **(contains VarDeclASTs and StmtASTs)**
* StmtAST
  - AssignStmtAST **(contains a LocAST and an ExprAST)**
  - FuncCallAST **(contains multiple ExprASTs)**
  - ConditionalStmtAST **(contains an ExprAST and either one or two BlockASTs)**
  - WhileLoopStmtAST **(contains an ExprAST and a BlockAST)**
  - ReturnStmtAST **(contains an optional ExprAST)**
* ExprAST **(contain DecafType for typechecking and 'value' for interpretation)**
  - BinaryExprAST **(contains two ExprASTs)**
  - UnaryExprAST **(contains one ExprAST)**
  - LocAST **(contains an optional ExprASTs)**
  - FuncCallAST **(contains multiple ExprASTs)**
  - LiteralAST
