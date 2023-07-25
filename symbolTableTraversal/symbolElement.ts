import symbolVisitorInterface from "./symbolVisitorInterface"

export default interface symbolElement {
    acceptSymbolElement: (visitor: symbolVisitorInterface) => void
}