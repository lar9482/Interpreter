import miscAnalysisVisitorInterface from "../MiscAnalysisVisitorInterface"

//miscAnalyzeElement will be AST nodes that require further analysis beyond type-checking
export default interface miscAnalyzeElement {
    acceptAnalyzeElement: (visitor: miscAnalysisVisitorInterface) => void
}