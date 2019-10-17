// euler's formula to get the face count in a connected graph
export function eulersFaceCountCheck(numVertices: number, numEdges: number): number {
    if (numVertices < 3) {
        throw new Error("cannot use euler's formula when there are less than three vertices")
    }
    return 2 - numVertices + numEdges - 1;   // - 1 remove's the outer face of infinite size
}