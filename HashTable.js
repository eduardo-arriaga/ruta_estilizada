/**
 * Simple container class for storing a key/data couple.
 */
class HashEntry
{
	key;
	
	data;
	
	constructor(key, data)
	{
		this.key = key;
		this.data = data;
	}
}
/**
 * A hash table using linked overflow for resolving collisions.
 */
class HashTable
{
    /**
     * A simple function for hashing strings.
     */
    static hashString(s)
    {
        var hash = 0, i, k = s.length;
        for (i = 0; i < k; i++)
            hash += (i + 1) * s.charCodeAt(i);
        return hash;
    }
    
    /**
     * A simple function for hashing integers.
     */
    static hashInt(i)
    {
        return hashString(i.toString());
    }
    
    #table;
    #hash;
    
    #size;
    #divisor;
    #count;
    
    /**
     * Initializes a hash table.
     * 
     * @param size The size of the hash table.
     * @param hash A hashing function.
     */
    constructor(size, hash = null)
    {
        this.#count = 0;
        
        this.#hash = (hash == null) ? function(key) { return key; } : hash;
        this.#table = new Array(this.#size = size);
        
        for (var i = 0; i < size; i++)
            this.#table[i] = [];
        
        this.#divisor = this.#size - 1;
    }
    
    /**
     * Inserts a key/data couple into the table.
     * 
     * @param key The key.
     * @param obj The data associated with the key.
     */
    insert(key, obj)
    {
        this.#table[int(this.#hash(key) & this.#divisor)].push(new HashEntry(key, obj));
        this.#count++;
    }
    
    /**
     * Finds the entry that is associated with the given key.
     * 
     * @param  key The key to search for.
     * @return The data associated with the key or null if no matching
     *         entry was found.
     */
    find(key)
    {
        var list = this.#table[int(this.#hash(key) & this.#divisor)];
        var k = list.length, entry;
        for (var i = 0; i < k; i++)
        {
            entry = list[i];
            if (entry.key === key)
                return entry.data;
        }
        return null;
    }
    
    /**
     * Removes an entry based on a given key.
     * 
     * @param  key The entry's key.
     * @return The data associated with the key or null if no matching
     *         entry was found.
     */
    remove(key)
    {
        var list = this.#table[int(this.#hash(key) & this.#divisor)];
        var k = list.length;
        for (var i = 0; i < k; i++)
        {
            var entry = list[i];
            if (entry.key === key)
            {
                list.splice(i, 1);
                return entry.data;
            }
        }
        return null;
    }
    
    /**
     * Checks if a given item exists.
     * 
     * @return True if item exists, otherwise false.
     */
    contains(obj)
    {
        var list, k = size;
        for (var i = 0; i < k; i++)
        {
            list = this.#table[i];
            var l = list.length; 
            
            for (var j = 0; j < l; j++)
                if (list[j].data === obj) return true;
        }
        return false;
    }
    
    /**
     * Iterator not supported (yet).
     */
    getIterator()
    {
        return new NullIterator();
    }
    
    /**
     * Clears all elements.
     */
    clear()
    {
        this.#table = new Array(this.#size);
        this.#count = 0;
    }
    
    /**
     * The total number of items.
     */
    size()
    {
        return this.#count;
    }
    
    /**
     * The maximum allowed size of the queue.
     */
    maxSize()
    {
        return this.#size;
    }
    
    /**
     * Converts the structure into an array.
     * 
     * @return An array.
     */
    toArray()
    {
        var a = [], list, k = size;
        for (var i = 0; i < k; i++)
        {
            list = this.#table[i];
            var l = list.length; 
            
            for (var j = 0; j < l; j++)
                a.push(list[j]);
        }
        return a;
    }
    
    /**
     * Returns a string representing the current object.
     */
    toString()
    {
        return "[HashTable, size=" + size + "]";
    }
    
    print()
    {
        var s = "HashTable:\n";
        for (var i = 0; i < this.#size; i++)
        {
            if (this.#table[i])
                s += "[" + i + "]" + "\n" + this.#table[i];
        }
        return s;
    }
}


