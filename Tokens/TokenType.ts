
export enum TokenType {
    //Keywords
    Token_Def = "def", //def
    Token_If = "if", //if
    Token_Else = "else", //else
    Token_While = "while", //while
    Token_Return = "return", //return 
    Token_Break = "break", //break
    Token_Continue = "continue", //continue
    Token_Int = "int", //int
    Token_Bool = "bool", //bool
    Token_Void = "void", //void
    Token_True = "true", //true
    Token_False = "false", //false

    //Symbols
    Token_StartParen = "(", //    (
    Token_StartCurly = "{", //    {
    Token_StartBracket = "[", //  [
    Token_CloseParen = ")", //    )
    Token_CloseCurly = "}", //    }
    Token_CloseBracket = "]", //  ]
    Token_Comma = ",", //         ,
    Token_Semicolon = ";", //     ;
    Token_Assign = "=", //        =
    Token_Plus = "+", //          +
    Token_Minus = "-", //         -
    Token_Multiply = "*", //      *
    Token_Divide = "/", //        /
    Token_Modus = "%", //         %
    Token_LessThan = "<",//       <
    Token_MoreThan = ">",//       >
    Token_LessThanEqual = "<=",//  <=
    Token_MoreThanEqual = ">=",//  >=
    Token_Equal = "==", //         ==
    Token_NotEqual = "!=", //      !=
    Token_And = "&&", //           &&
    Token_Or = "||", //            ||
    Token_Not = "!", //           !

    //Identifier
    Token_Identifier = "ID",

    //Literals
    Token_DecLiteral = "DEC",
    Token_HexLiteral = "HEX",
    Token_StrLiteral = "STR",

    //Ending
    Token_Epsilon = "ε"
}