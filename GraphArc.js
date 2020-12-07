/**
 * A weighted arc pointing to a graph node.
 */
class GraphArc
{
    /**
     * The node that the arc points to being referenced.
     */
    node;
    
    /**
     * The weight (or cost) of the arc.
     */
    weight;
    
    /**
     * Initializes a new graph arc with a given weight.
     * 
     * @param node 		The graph node.
     * @param weight 	The weight.
     */
    invisible;
    constructor(node, weight = 1)
    {
        this.node = node;
        this.weight = weight;
        this.invisible = false;
    }
}
