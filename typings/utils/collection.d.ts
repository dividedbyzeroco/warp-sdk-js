import _Object from '../classes/object';
export default class Collection {
    _objects: Array<_Object>;
    constructor(objects: Array<_Object>);
    readonly length: number;
    count(): number;
    /**
     * Get the first item from the collection
     */
    first(): _Object | null;
    /**
     * Get the last Object from the collection
     */
    last(): _Object | null;
    /**
     * Return Objects that pass a given evaluator
     * @param {Function} evaluator
     */
    where(evaluator: (object: _Object) => boolean): Collection;
    /**
     * Map Objects into an array using an iterator
     * @param {Function} iterator
     */
    map(iterator: (object: _Object) => any): Array<any>;
    /**
     * Iterate through each item
     * @param {Function} iterator
     */
    forEach(iterator: (object: _Object) => void): void;
    /**
     * Alias of toArray()
     */
    toList(): any[];
    /**
     * Convert the collection into an array
     */
    toArray(): any[];
    /**
     * Convert the collection into an object literal
     */
    toJSON(): any[];
    /**
     * Run a promise iterator over every Object, in series
     * @param {Function} iterator
     */
    each(iterator: (object: _Object) => Promise<any>): Promise<void>;
    /**
     * Run a promise iterator over every Object, in parallel
     */
    all(iterator: (object: _Object) => Promise<any>): Promise<void>;
    [Symbol.iterator](): Iterator<_Object | undefined>;
}
