import inferenceVisitorInterface from "../InferenceVisitorInterface"

//inferenceElements will be AST nodes that require inference.
export default interface inferenceElement {
    acceptInferenceElement: (visitor: inferenceVisitorInterface) => void
}