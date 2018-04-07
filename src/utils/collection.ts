import _Object from '../classes/object';

export default class Collection<T extends _Object> {

    _objects: Array<T>;

    constructor(objects: Array<T>) {
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
    first(): T | null {
        return this._objects.length > 0? this._objects[0] : null;
    }

    /**
     * Get the last Object from the collection
     */
    last(): T | null {
        return this._objects.length > 0? this._objects[this._objects.length - 1] : null;
    }

    /**
     * Return Objects that pass a given evaluator
     * @param {Function} evaluator 
     */
    where(evaluator: (object: T) => boolean): Collection<T> {
        const objects = [...this._objects];
        const map: Array<T> = [];

        for(let object of objects) {
            if(evaluator(object)) {
                map.push(object);
            }
        }

        const constructor = this.constructor as typeof Collection;
        return new constructor(map);
    }

    /**
     * Map Objects into an array using an iterator
     * @param {Function} iterator 
     */
    map(iterator: (object: T) => any): Array<any> {
        const objects = [...this._objects];
        const map: Array<any> = [];

        for(let object of objects) {
            map.push(iterator(object));
        }

        return map;
    }

    /**
     * Iterate through each item
     * @param {Function} iterator 
     */
    forEach(iterator: (object: T) => void): void {
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
     * Convert the collection into an object literal
     */
    toJSON() {
        return this.map(object => object.toJSON());
    }

    /**
     * Run a promise iterator over every Object, in series
     * @param {Function} iterator
     */
    async each(iterator: (object: T) => Promise<any>): Promise<void> {
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
    async all(iterator: (object: T) => Promise<any>): Promise<void> {
        // Define iterators
        const iterators = this.map(object => iterator(object));

        await Promise.all(iterators);
        return;
    }

    [Symbol.iterator](): Iterator<T | undefined> {
        // Set index to 0
        let _index = 0;

        return {
            next: () => {
                // Check if object list has reached the end
                if(this._objects.length === _index) {
                    // Reset index
                    _index = 0;

                    // Return iterator result
                    return { value: undefined, done: true };
                }

                // Return iterator result
                return { value: this._objects[_index++], done: false };
            }
        };
    }
}