// @flow
/**
 * References
 */
import _Object from '../classes/object';

export default class Collection {

    _objects: Array<_Object>;

    constructor(objects: Array<_Object>) {
        this._objects = objects;
    }

    get length(): number {
        return this.count();
    }

    count(): number {
        return this._objects.length;
    }

    /**
     * Get the first item from the collection
     */
    first(): _Object | null {
        return this._objects.length > 0? this._objects[0] : null;
    }

    /**
     * Get the last Object from the collection
     */
    last(): ?_Object | null {
        return this._objects.length > 0? this._objects[this._objects.length - 1] : null;
    }

    /**
     * Return Objects that pass a given evaluator
     * @param {Function} evaluator 
     */
    where(evaluator: (object: _Object) => boolean): this {
        const objects = [...this._objects];
        const map = [];

        for(let object of objects) {
            if(evaluator(object)) {
                map.push(object);
            }
        }

        const constructor = this.constructor;
        return new constructor(map);
    }

    /**
     * Map Objects into an array using an iterator
     * @param {Function} iterator 
     */
    map(iterator: (object: _Object) => any): Array<any> {
        const objects = [...this._objects];
        const map = [];

        for(let object of objects) {
            map.push(iterator(object));
        }

        return map;
    }

    /**
     * Iterate through each item
     * @param {Function} iterator 
     */
    forEach(iterator: (object: _Object) => void): void {
        const objects = [...this._objects];

        for(let object of objects) {
            iterator(object);
        }
    }

    /**
     * Alias of toArray()
     */
    toList() {
        return this.toArray();
    }

    /**
     * Convert the collection into an array
     */
    toArray() {
        return this.map(object => object);
    }

    /**
     * Run a promise iterator over every Object, in series
     * @param {Function} iterator
     */
    async each(iterator: (object: _Object) => Promise<any>): Promise<void> {
        // Get objects
        const objects = [...this._objects];

        for(let object of objects) {
            await iterator(object);
        }

        return;
    }

    /**
     * Run a promise iterator over every Object, in parallel
     */
    async all(iterator: (object: _Object) => Promise<any>): Promise<void> {
        // Define iterators
        const iterators = this.map(object => iterator(object));

        await Promise.all(iterators);
        return;
    }

    // $FlowFixMe
    [Symbol.iterator](): Iterator<_Object, void> {
        let _index = 0;

        return {
            next: () => {
                if(_index < this.length) {
                    return { value: this._objects[_index++], done: false };
                }
                else {
                    _index = 0;
                    return { done: true };
                }
            }
        };
    }
}