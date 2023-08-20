import interpretVisitorInterface from "../InterpretVisitorInterface"

//interpretElements will be AST nodes that will actually be 'executed'
export default interface interpretElement {
    acceptInterpretElement: (visitor: interpretVisitorInterface) => void
}