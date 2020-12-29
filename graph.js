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

class GraphNode
{
    data;
    
    arcs;
    
    marked;
    traverseCount = 0;
    
    _arcCount = 0;
    
    constructor(obj)
    {
        this.data = obj;
        this._arcCount = 0;
        this.arcs = new Array(this._arcCount);
        this.marked = false;
    }
    
    addArc(target, weight)
    {
        this.arcs[this._arcCount] = new GraphArc(target, weight);
        this._arcCount++;
    }

    removeArc(target)
    {
        for (var i = 0; i < this._arcCount; i++)
        {
            if (this.arcs[i].node == target)
            {
                this.arcs.splice(i, 1);
                this._arcCount--;
                return true;
            }
        }
        return false;
    }
    
    getArc(target)
    {
        for (var i = 0 ; i < this._arcCount; i++)
        {
            var arc = this.arcs[i];
            if (arc.node == target) return arc;
        }
        return null;
    }
    
    numArcs()
    {
        return this._arcCount;
    }
}

class Graph
{
    nodes;
    
    _nodeCount;
    _maxSize;
    
    constructor(size)
    {
        this._maxSize = size;
        this.nodes = new Array(this._maxSize);
        this._nodeCount = 0;
    }
    
    depthFirst(node, process)
    {
        if (!node) return;
        
        process(node);
        node.marked = true;
        
        var k = node.numArcs(), t;
        for (var i = 0; i < k; i++)
        {
            t = node.arcs[i].node;
            if (!t.marked) 
                depthFirst(t, process);
        }
    }
    
    breadthFirst(node, process)
    {
        if (!node) return;
        
        var queSize = 1;
        var que = [node];
        node.marked = true;
        
        var c = 1, k, i, arcs;
        var t, u;
        while (c > 0)
        {
            process(t = que[0]);
            
            arcs = t.arcs, k = t.numArcs();
            for (i = 0; i < k; i++)
            {
                u = arcs[i].node;
                if (!u.marked)
                {
                    u.marked = true;
                    que[int(queSize++)] = u;
                    
                    c++;
                }
            }
            que.shift();
            queSize--;
            c--;
        }
    }
    
    breadthFirstSearch(node, dest)
    {
        if (!node) return;
        
        var traverseCount = 0;
        var queSize = 1;
        var que = [node];
        node.marked = true;
        
        var c = 1, k, i, arcs;
        var t, u;
        while (c > 0)
        {
            t = que[0];
            if (t == dest)
            {
                return t.traverseCount;
            }
            traverseCount=t.traverseCount + 1;
            
            arcs = t.arcs, k = t.numArcs();
            for (i = 0; i < k; i++)
            {
                u = arcs[i].node;
                if (!u.marked)
                {
                    u.marked = true;
                    u.traverseCount = traverseCount;
                    que[int(queSize++)] = u;
                    
                    c++;
                }
            }
            que.shift();
            queSize--;
            c--;
            
        }
        return 100000;
    }
    
    addNode(obj, i)
    {
        if (this.nodes[i]) return false;
        
        this.nodes[i] = new GraphNode(obj);
        this._nodeCount++;
        return true;
    }
    
    removeNode(i)
    {
        var node = this.nodes[i];
        if(!node) return false;
        
        for (var j = 0; j < this._maxSize; j++)
        {
            var t = this.nodes[j];
            if (t && t.getArc(node)) removeArc(j, i);
        }
        
        this.nodes[i] = null;
        this._nodeCount--;
        return true;
    }
    
    getArc(from, to)
    {
        var node0 = this.nodes[from];
        var node1 = this.nodes[to];
        if (node0 && node1) return node0.getArc(node1);
        return null;
    }
    
    addArc(from, to, weight = 1)
    {
        var node0 = this.nodes[from];
        var node1 = this.nodes[to];
        
        if (node0 && node1)
        {
            if (node0.getArc(node1)) return false;
        
            node0.addArc(node1, weight);
            return true;
        }
        return false;
    }
    
    removeArc(from, to)
    {
        var node0 = this.nodes[from];
        var node1 = this.nodes[to];
        
        if (node0 && node1)
        {
            node0.removeArc(node1);
            return true;
        }
        return false;
    }
    
    clearMarks()
    {
        for (var i = 0; i < this._maxSize; i++)
        {
            var node = this.nodes[i];
            if (node) {
                node.marked = false;
                node.traverseCount = 0;
            }
        }
    }
    
    size()
    {
        return this._nodeCount;
    }
    
    maxSize()
    {
        return this._maxSize;
    }
    
    clear()
    {
        this.nodes = new Array(this._maxSize);
        this._nodeCount = 0;
    }
}
