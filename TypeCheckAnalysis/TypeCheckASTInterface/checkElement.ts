import checkVisitorInterface from "../CheckVisitorInterface"

//checkElements will be AST nodes that require type checking.
export default interface checkElement {
    acceptCheckElement: (visitor: checkVisitorInterface) => void
}