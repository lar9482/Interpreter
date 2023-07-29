import symbolVisitorInterface from "./symbolVisitorInterface"

//symbolElements will be AST nodes that contain "symbols" for the interpreter.
export default interface symbolElement {
    acceptSymbolElement: (visitor: symbolVisitorInterface) => void
}