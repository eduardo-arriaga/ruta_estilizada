class GraphArc
{
    node;
    
    weight;
    
    invisible;
    constructor(node, weight = 1)
    {
        this.node = node;
        this.weight = weight;
        this.invisible = false;
    }
}
