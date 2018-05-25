import enforce from 'enforce-js';
import _Object from './object';
import Error from '../utils/error';
import KeyMap from '../utils/key-map';
import Collection from '../utils/collection';
import { InternalKeys } from '../utils/constants';
import { toDatabaseDate } from '../utils/format';
import ConstraintMap, { Constraints } from '../utils/constraint-map';
import { IHttpAdapter } from '../types/http';
import { IStorageAdapter } from '../types/storage';

export default class Query<T extends _Object> {

    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    static _objectClass: typeof _Object;
    _class: { new(): _Object };
    _select: Array<string> = [];
    _include: Array<string> = [];
    _where: ConstraintMap = new ConstraintMap();
    _sort: Array<string> = [];
    _skip: number;
    _limit: number;

    constructor(className: { new(): T } | string) {
        // Check if className is a string
        if(typeof className === 'string') {
            // Get the name as a string
            const name: string = className;

            // Extend Warp.Object and use the new className
            this._class = class extends this.statics()._objectClass { get className(): string { return name; } };
        }
        // Check if className is a Warp.Object
        else if((new className) instanceof _Object) {
            this._class = className;
        }
        // Throw an error
        else
            throw new Error(Error.Code.ForbiddenOperation, `\`className\` must be a string or a \`Warp.Object\``);
    }

    /**
     * Initialize the query
     * @param {IHttpAdapter} http 
     * @param {IStorageAdapter} storage 
     */
    static initialize<Q extends typeof Query>(
        http: IHttpAdapter, 
        storage: IStorageAdapter, 
        objectClass: typeof _Object): Q 
    {
        this._http = http;
        this._storage = storage;
        this._objectClass = objectClass;
        return this as Q;
    }

    statics<Q extends typeof Query>(): Q {
        return this.constructor as Q;
    }

    /**
     * Set a key constraint
     * @param {String} key 
     * @param {String} constraint 
     * @param {*} value 
     */
    _set(key: string, constraint: string, value: any) {
        // Enforce
        enforce`${{ key }} as a string`;

        // Convert to string if value is a date
        if(value instanceof Date) value = toDatabaseDate(value.toISOString());

        // Set the constraint
        this._where.set(key, constraint, value);
        return this;
    }

    /**
     * Assert that the key is an exact match to the given value
     * @param {String} key 
     * @param {*} value 
     */
    equalTo(key: string, value: any): this {
        this._set(key, Constraints.EqualTo, value);
        return this;
    }

    /**
     * Assert that the key is not an exact match to the given value
     * @param {String} key 
     * @param {*} value 
     */
    notEqualTo(key: string, value: any): this {
        this._set(key, Constraints.NotEqualTo, value);
        return this;
    }

    /**
     * Assert that the key is greater than the given value
     * @param {String} key 
     * @param {*} value 
     */
    greaterThan(key: string, value: any): this {
        this._set(key, Constraints.GreaterThan, value);
        return this;
    }

    /**
     * Assert that the key is greater than or equal to the given value
     * @param {String} key 
     * @param {*} value 
     */
    greaterThanOrEqualTo(key: string, value: any): this {
        this._set(key, Constraints.GreaterThanOrEqualTo, value);
        return this;
    }

    /**
     * Assert that the key is less than the given value
     * @param {String} key 
     * @param {*} value 
     */
    lessThan(key: string, value: any): this {
        this._set(key, Constraints.LessThan, value);
        return this;
    }

    /**
     * Assert that the key is less than or equal to the given value
     * @param {String} key 
     * @param {*} value 
     */
    lessThanOrEqualTo(key: string, value: any): this {
        this._set(key, Constraints.LessThanOrEqualTo, value);
        return this;
    }

    /**
     * Assert that the key is not null
     * @param {String} key 
     * @param {*} value 
     */
    exists(key: string): this {
        this._set(key, Constraints.Exists, true);
        return this;
    }

    /**
     * Assert that the key is null
     * @param {String} key 
     * @param {*} value 
     */
    doesNotExist(key: string): this {
        this._set(key, Constraints.Exists, false);
        return this;
    }

    /**
     * Assert that the key is one of the given values
     * @param {String} key 
     * @param {*} value 
     */
    containedIn(key: string, value: Array<any>): this {
        this._set(key, Constraints.ContainedIn, value);
        return this;
    }

    /**
     * Assert that the key is not any of the given values
     * @param {String} key 
     * @param {*} value 
     */
    notContainedIn(key: string, value: Array<any>): this {
        this._set(key, Constraints.NotContainedIn, value);
        return this;
    }

    /**
     * Assert that the key is either one of the values or is null
     * @param {String} key 
     * @param {*} value 
     */
    containedInOrDoesNotExist(key: string, value: Array<any>): this {
        this._set(key, Constraints.ContainedInOrDoesNotExist, value);
        return this;
    }

    /**
     * Assert that the key starts with the given string
     * @param {String} key 
     * @param {*} value 
     */
    startsWith(key: string, value: string): this {
        this._set(key, Constraints.StartsWith, value);
        return this;
    }

    /**
     * Assert that the key ends with the given string
     * @param {String} key 
     * @param {*} value 
     */
    endsWith(key: string, value: string): this {
        this._set(key, Constraints.EndsWith, value);
        return this;
    }

    /**
     * Assert that the key contains the given string
     * @param {String} key 
     * @param {String} value 
     */
    contains(key: string | string[], value: string): this {
        if(key instanceof Array) key = key.join('|');
        this._set(key, Constraints.Contains, value);
        return this;
    }

    /**
     * Assert that the key contains either of the given strings
     * @param {String} key 
     * @param {*} value 
     */
    containsEither(key: string | string[], value: Array<string>): this {
        if(key instanceof Array) key = key.join('|');
        this._set(key, Constraints.ContainsEither, value);
        return this;
    }

    /**
     * Assert that the key contains all of the given strings
     * @param {String} key 
     * @param {*} value 
     */
    containsAll(key: string | string[], value: Array<string>): this {
        if(key instanceof Array) key = key.join('|');
        this._set(key, Constraints.ContainsAll, value);
        return this;
    }

    /**
     * Assert that the key matches a key in a subquery
     * @param {String} key 
     * @param {String} select 
     * @param {Object} value 
     */
    foundIn(key: string, select: string, value: Query<_Object>): this {
        this._set(key, Constraints.FoundIn, value.toSubquery(select));
        return this;
    }

    /**
     * Assert that the key matches a key in any of the given subqueries
     * @param {String} key
     * @param {Array} value 
     */
    foundInEither(key: string, value: Array<Query<_Object>>): this {
        this._set(key, Constraints.FoundInEither, value.map(item => {
            const select = Object.keys(item)[0];
            const query = item[select];
            return query.toSubquery(select);
        }));
        return this;
    }

    /**
     * Assert that the key matches a key in all of the given subqueries
     * @param {String} key
     * @param {Array} value 
     */
    foundInAll(key: string, value: Array<Query<_Object>>): this {
        this._set(key, Constraints.FoundInAll, value.map(item => {
            const select = Object.keys(item)[0];
            const query = item[select];
            return query.toSubquery(select);
        }));
        return this;
    }

    /**
     * Assert that the key does not match a key in the given subquery
     * @param {String} key 
     * @param {String} select 
     * @param {Object} value 
     */
    notFoundIn(key: string, select: string, value: Query<_Object>): this {
        this._set(key, Constraints.NotFoundIn, value.toSubquery(select));
        return this;
    }

    /**
     * Assert that the key does not match a key in all of the given subqueries
     * @param {String} key
     * @param {Array} value 
     */
    notFoundInEither(key: string, value: Array<Object>): this {
        this._set(key, Constraints.NotFoundInEither, value.map(item => {
            const select = Object.keys(item)[0];
            const query = item[select];
            return query.toSubquery(select);
        }));
        return this;
    }

    /**
     * Select specific columns to query
     * @param {String} keys
     */
    select(...keys: Array<any>): this {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'Select key must be a string or an array of strings');
        const keyList: Array<string> = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._select.push(key);
        }

        return this;
    }

    /**
     * Include pointer keys for the query
     * @param {String} keys
     */
    include(...keys: Array<any>): this {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'Include key must be a string or an array of strings');
        const keyList: Array<string> = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._include.push(key);
        }
        return this;
    }

    /**
     * Sort the query by the provided keys in ascending order
     * @param {String} keys
     */
    sortBy(...keys: Array<any>) {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'SortBy key must be a string or an array of strings');
        const keyList: Array<string> = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._sort.push(key);
        }
        return this;
    }

    /**
     * Sort the query by the provided keys in descending order
     * @param {String} keys
     */
    sortByDescending(...keys: Array<any>) {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'SortByDescending key must be a string or an array of strings');
        const keyList: Array<string> = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._sort.push(`-${key}`);
        }
        return this;
    }

    /**
     * Number of items to skip for the query
     * @param {String} keys
     */
    skip(value: number) {
        enforce`${{ skip: value }} as a number`;
        this._skip = value;
        return this;
    }

    /**
     * Number of items to fetch, at maximum
     * @param {String} keys
     */
    limit(value: number) {
        enforce`${{ limit: value }} as a number`;
        this._limit = value;
        return this;
    }

    /**
     * Find the Objects
     * @param {Function} callback 
     */
    async find<T extends _Object>(callback?: (result: Collection<T>) => Promise<any>): Promise<Collection<T>> {
        // Prepare params
        const sessionToken = this.statics()._storage.get(InternalKeys.Auth.SessionToken);
        const className = this._class.prototype.className;
        const select = this._select.length > 0? this._select : undefined;
        const include = this._include.length > 0? this._include : undefined;
        const where = this._where.toJSON();
        const sort = this._sort.length > 0? this._sort : undefined;
        const skip = this._skip;
        const limit = this._limit;

        // Find objects
        const result = await this.statics()._http.find({ 
            sessionToken, 
            className, 
            select, 
            include, 
            where,
            sort, 
            skip, 
            limit 
        });

        // Iterate through the result
        const objects: Array<T> = [];
        for(let data of result) {
            // Get the object id
            let id = data[InternalKeys.Id];
            delete data[InternalKeys.Id];

            // Create a new object
            let objectClass = this._class;
            let object = new objectClass() as T;

            // Automatically set the id, keys, and isDirty flag
            object._id = id;
            object._keyMap = new KeyMap(data);
            object._isDirty = false;

            // Push the object
            objects.push(object);
        }

        // Get collection
        const collection = new Collection<T>(objects);

        // If callback is provided, use callback
        if(typeof callback === 'function') {
            const next = callback(collection);
            return await next;
        }

        // Return the objects
        return collection;
    }

    /**
     * Get the first Object from the query
     * @param {Function} callback 
     */
    async first(callback?: (result: T | null) => Promise<any>): Promise<T | null> {
        // Prepare params
        this._skip = 0;
        this._limit = 1;

        // Find objects
        const result: Collection<T> = await this.find<T>();

        // If result length is 0, return null
        if(result.length === 0) return null;

        // Get the object
        const object = result.first();

        // If callback is provided, use callback
        if(typeof callback === 'function') {
            const next = callback(object);
            return await next;
        }

        // Return the object
        return object;
    }

    /**
     * Get an Object by its Id
     * @param {Function} callback 
     */
    async get(id: number): Promise<T> {
        // Prepare params
        const sessionToken = this.statics()._storage.get(InternalKeys.Auth.SessionToken);
        const className = this._class.prototype.className;
        const select = this._select.length > 0? this._select : undefined;
        const include = this._include.length > 0? this._include : undefined;

        // Find object
        const data = await this.statics()._http.get({ 
            sessionToken, 
            className, 
            select, 
            include,
            id
        });
        
        // Create a new object
        let objectClass = this._class;
        let object = new objectClass() as T;

        // Automatically set the id, keys, and isDirty flag
        object._id = id;
        object._keyMap = new KeyMap(data);
        object._isDirty = false;

        // Return the object
        return object;
    }

    /**
     * Convert the query into a subquery
     * @param {String} select 
     */
    toSubquery(select: string) {
        const classNameKey = this._class.prototype.statics()._supportLegacy? 
            InternalKeys.Pointers.LegacyClassName
            : InternalKeys.Pointers.ClassName;
        const className = this._class.prototype.className;
        const where = this._where.toJSON();

        return { [classNameKey]: className, where, select };
    }
}