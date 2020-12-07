/**
 * DATA STRUCTURES FOR GAME PROGRAMMERS
 * Copyright (c) 2007 Michael Baczynski, http://www.polygonal.de
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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

/**
 * A graph node.
 */
class GraphNode
{
    /**
     * The data being referenced.
     */
    data;
    
    /**
     * An array of arcs connecting this node to other nodes.
     */
    arcs;
    
    /**
     * A flag indicating whether the node is marked or not.
     * Used for iterating over a graph structure.
     */
    marked;
    traverseCount = 0;
    
    _arcCount = 0;
    
    /**
     * Constructs a new graph node.
     * 
     * @param obj The data to store inside the node.
     */
    constructor(obj)
    {
        this.data = obj;
        this._arcCount = 0;
        this.arcs = new Array(this._arcCount);
        this.marked = false;
    }
    
    /**
     * Adds an arc to the current graph node, pointing to a different
     * graph node and with a given weight.
     * 
     * @param target The destination node the arc should point to.
     * @param weigth The arc's weigth.
     */
    addArc(target, weight)
    {
        this.arcs[this._arcCount] = new GraphArc(target, weight);
        this._arcCount++;
    }

    /**
     * Removes the arc that points to the given node.
     * 
     * @return True if removal was successful, otherwise false.
     */
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
    
    /**
     * Finds the arc that points to the given node.
     * 
     * @param  target The destination node.
     * 
     * @return A GraphArc object or null if the arc doesn't exist.
     */
    getArc(target)
    {
        for (var i = 0 ; i < this._arcCount; i++)
        {
            var arc = this.arcs[i];
            if (arc.node == target) return arc;
        }
        return null;
    }
    
    /**
     * The number of arcs extending from this node.
     */
    numArcs()
    {
        return this._arcCount;
    }
}

/**
 * A linked uni-directional weighted graph structure.
 * <p>The Graph class manages all graph nodes. Each graph node has
 * a linked list of arcs, pointing to different nodes.</p>
 */
class Graph
{
    /**
     * An array containing all graph nodes.
     */
    nodes;
    
    _nodeCount;
    _maxSize;
    
    /**
     * Constructs an empty graph.
     * 
     * @param size The total number of nodes allowed.
     */
    constructor(size)
    {
        this._maxSize = size;
        this.nodes = new Array(this._maxSize);
        this._nodeCount = 0;
    }
    
    /**
     * Performs a depth-first traversal on the given node.
     * 
     * @param node    The starting graph node.
     * @param process A function to apply to each traversed node.
     */
    depthFirst(node, process)
    {
        if (!node) return;
        
        process(node);
        node.marked = true;
        
        var k = node.numArcs, t;
        for (var i = 0; i < k; i++)
        {
            t = node.arcs[i].node;
            if (!t.marked) 
                depthFirst(t, process);
        }
    }
    
    /**
     * Performs a breadth-first traversal on the given node.
     * 
     * @param node    The starting graph node.
     * @param process A function to apply to each traversed node.
     */
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
            
            arcs = t.arcs, k = t.numArcs;
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
    
    /**
     * Performs a breadth-first search on the given node. Y devuelve cuanto pasos hay que dar para llegar.
     * 
     * @param node    The starting graph node.
     * @param node    The destination node.
     */
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
            
            arcs = t.arcs, k = t.numArcs;
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
    
    /**
     * Adds a node at a given index to the graph.
     * 
     * @param obj The data to store in the node.
     * @param i   The index the node is stored at.
     * @return True if successful, otherwise false.
     */
    addNode(obj, i)
    {
        if (this.nodes[i]) return false;
        
        this.nodes[i] = new GraphNode(obj);
        this._nodeCount++;
        return true;
    }
    
    /**
     * Removes a node from the graph at a given index.
     * 
     * @param index Index of the node to remove
     * @return True if successful, otherwise false.
     */
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
    
    /**
     * Finds an arc pointing to the node
     * at the 'from' index to the node at the 'to' index.
     * 
     * @param from The originating graph node index.
     * @param to   The ending graph node index.
     * @return A GraphArc object or null if it doesn't exist.
     */
    getArc(from, to)
    {
        var node0 = this.nodes[from];
        var node1 = this.nodes[to];
        if (node0 && node1) return node0.getArc(node1);
        return null;
    }
    
    /**
     * Adds an arc pointing to the node located at the
     * 'from' index to the node at the 'to' index.
     * 
     * @param from   The originating graph node index.
     * @param to     The ending graph node index.
     * @param weight The arc's weight
     *
     * @return True if an arc was added, otherwise false.
     */
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
    
    /**
     * Removes an arc pointing to the node located at the
     * 'from' index to the node at the 'to' index.
     * 
     * @param from The originating graph node index.
     * @param to   The ending graph node index.
     * 
     * @return True if an arc was removed, otherwise false.
     */
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
    
    /**
     * Clears the markers on all nodes in the graph
     * so the breadth-first and depth-first traversal
     * algorithms can 'see' the nodes.
     */
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
    
    /**
     * The number of nodes in the graph.
     */
    size()
    {
        return this._nodeCount;
    }
    
    /**
     * The maximum number of nodes the
     * graph can store.
     */
    maxSize()
    {
        return this._maxSize;
    }
    
    /**
     * Clears every node in the graph.
     */
    clear()
    {
        this.nodes = new Array(this._maxSize);
        this._nodeCount = 0;
    }
}
