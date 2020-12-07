/**
 * An do-nothing iterator for structures that don't support iterators.
 */
class NullIterator
{
    constructor() 
    {
    
    }
    
    start()
    {
    }
    
    next()
    {
        return null;
    }

    hasNext()
    {
        return false;
    }
    
    data()
    {
        return null;
    }
    
    data(obj)
    {
    }
}