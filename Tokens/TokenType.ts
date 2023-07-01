
export enum TokenType {
    //Keywords
    Token_Def, //def
    Token_If, //if
    Token_Else, //else
    Token_While, //while
    Token_Return, //return 
    Token_Break, //break
    Token_Continue, //continue
    Token_Int, //int
    Token_Bool, //bool
    Token_Void, //void
    Token_True, //true
    Token_False, //false

    //Symbols
    Token_StartParen, //    (
    Token_StartCurly, //    {
    Token_StartBracket, //  [
    Token_CloseParen, //    )
    Token_CloseCurly, //    }
    Token_CloseBracket, //  ]
    Token_Comma, //         ,
    Token_Semicolon, //     ;
    Token_Assign, //        =
    Token_Plus, //          +
    Token_Minus, //         -
    Token_Multiply, //      *
    Token_Divide, //        /
    Token_Modus, //         %
    Token_LessThan,//       <
    Token_MoreThan,//       >
    Token_LessThanEqual,//  <=
    Token_MoreThanEqual,//  >=
    Token_Equal, //         ==
    Token_NotEqual, //      !=
    Token_And, //           &&
    Token_Or, //            ||
    Token_Not, //           !

    //Identifier
    Token_Identifier,

    //Literals
    Token_DecLiteral,
    Token_HexLiteral,
    Token_StrLiteral
}