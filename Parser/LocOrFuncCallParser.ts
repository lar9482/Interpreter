// PREDICT:
// parseLocOrFunc ->  Id LocOrFuncDetails : Id
// LocOrFuncDetails ->  IndexOrNot : ) [ ; = BINOP
// LocOrFuncDetails ->  ( ArgsOrNot ) : (
// IndexOrNot ->  [ Expr ] : [
// IndexOrNot ->  ) : )
// IndexOrNot ->  ; : ;
// IndexOrNot ->  = : =
// IndexOrNot ->  BINOP : BINOP
// ArgsOrNot ->  Args : Expr
// ArgsOrNot -> epsilon : )
// Args ->  Expr ArgsTail : Expr
// ArgsTail ->  , Expr ArgsTail : ,
// ArgsTail -> epsilon : )