import _Object from './object';
import Collection from '../utils/collection';
import ConstraintMap from '../utils/constraint-map';
import { IHttpAdapter } from '../types/http';
import { IStorageAdapter } from '../types/storage';
export default class Query<T extends _Object> {
    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    static _objectClass: typeof _Object;
    _class: typeof _Object;
    _select: Array<string>;
    _include: Array<string>;
    _where: ConstraintMap;
    _sort: Array<string>;
    _skip: number;
    _limit: number;
    constructor(className: typeof _Object | string);
    /**
     * Initialize the query
     * @param {IHttpAdapter} http
     * @param {IStorageAdapter} storage
     */
    static initialize<Q extends typeof Query>(http: IHttpAdapter, storage: IStorageAdapter, objectClass: typeof _Object): Q;
    statics<Q extends typeof Query>(): Q;
    /**
     * Set a key constraint
     * @param {String} key
     * @param {String} constraint
     * @param {*} value
     */
    _set(key: string, constraint: string, value: any): this;
    /**
     * Assert that the key is an exact match to the given value
     * @param {String} key
     * @param {*} value
     */
    equalTo(key: string, value: any): this;
    /**
     * Assert that the key is not an exact match to the given value
     * @param {String} key
     * @param {*} value
     */
    notEqualTo(key: string, value: any): this;
    /**
     * Assert that the key is greater than the given value
     * @param {String} key
     * @param {*} value
     */
    greaterThan(key: string, value: any): this;
    /**
     * Assert that the key is greater than or equal to the given value
     * @param {String} key
     * @param {*} value
     */
    greaterThanOrEqualTo(key: string, value: any): this;
    /**
     * Assert that the key is less than the given value
     * @param {String} key
     * @param {*} value
     */
    lessThan(key: string, value: any): this;
    /**
     * Assert that the key is less than or equal to the given value
     * @param {String} key
     * @param {*} value
     */
    lessThanOrEqualTo(key: string, value: any): this;
    /**
     * Assert that the key is not null
     * @param {String} key
     * @param {*} value
     */
    exists(key: string): this;
    /**
     * Assert that the key is null
     * @param {String} key
     * @param {*} value
     */
    doesNotExist(key: string): this;
    /**
     * Assert that the key is one of the given values
     * @param {String} key
     * @param {*} value
     */
    containedIn(key: string, value: Array<any>): this;
    /**
     * Assert that the key is not any of the given values
     * @param {String} key
     * @param {*} value
     */
    notContainedIn(key: string, value: Array<any>): this;
    /**
     * Assert that the key is either one of the values or is null
     * @param {String} key
     * @param {*} value
     */
    containedInOrDoesNotExist(key: string, value: Array<any>): this;
    /**
     * Assert that the key starts with the given string
     * @param {String} key
     * @param {*} value
     */
    startsWith(key: string, value: string): this;
    /**
     * Assert that the key ends with the given string
     * @param {String} key
     * @param {*} value
     */
    endsWith(key: string, value: string): this;
    /**
     * Assert that the key contains the given string
     * @param {String} key
     * @param {String} value
     */
    contains(key: string | string[], value: string): this;
    /**
     * Assert that the key contains either of the given strings
     * @param {String} key
     * @param {*} value
     */
    containsEither(key: string | string[], value: Array<string>): this;
    /**
     * Assert that the key contains all of the given strings
     * @param {String} key
     * @param {*} value
     */
    containsAll(key: string | string[], value: Array<string>): this;
    /**
     * Assert that the key matches a key in a subquery
     * @param {String} key
     * @param {String} select
     * @param {Object} value
     */
    foundIn(key: string, select: string, value: Query<_Object>): this;
    /**
     * Assert that the key matches a key in any of the given subqueries
     * @param {String} key
     * @param {Array} value
     */
    foundInEither(key: string, value: Array<Query<_Object>>): this;
    /**
     * Assert that the key matches a key in all of the given subqueries
     * @param {String} key
     * @param {Array} value
     */
    foundInAll(key: string, value: Array<Query<_Object>>): this;
    /**
     * Assert that the key does not match a key in the given subquery
     * @param {String} key
     * @param {String} select
     * @param {Object} value
     */
    notFoundIn(key: string, select: string, value: Query<_Object>): this;
    /**
     * Assert that the key does not match a key in all of the given subqueries
     * @param {String} key
     * @param {Array} value
     */
    notFoundInEither(key: string, value: Array<Object>): this;
    /**
     * Select specific columns to query
     * @param {String} keys
     */
    select(...keys: Array<any>): this;
    /**
     * Include pointer keys for the query
     * @param {String} keys
     */
    include(...keys: Array<any>): this;
    /**
     * Sort the query by the provided keys in ascending order
     * @param {String} keys
     */
    sortBy(...keys: Array<any>): this;
    /**
     * Sort the query by the provided keys in descending order
     * @param {String} keys
     */
    sortByDescending(...keys: Array<any>): this;
    /**
     * Number of items to skip for the query
     * @param {String} keys
     */
    skip(value: number): this;
    /**
     * Number of items to fetch, at maximum
     * @param {String} keys
     */
    limit(value: number): this;
    /**
     * Find the Objects
     * @param {Function} callback
     */
    find<T extends _Object>(callback?: (result: Collection<T>) => Promise<any>): Promise<Collection<T>>;
    /**
     * Get the first Object from the query
     * @param {Function} callback
     */
    first<T extends _Object>(callback?: (result: T | null) => Promise<any>): Promise<T | null>;
    /**
     * Get an Object by its Id
     * @param {Function} callback
     */
    get<T extends _Object>(id: number): Promise<T>;
    /**
     * Convert the query into a subquery
     * @param {String} select
     */
    toSubquery(select: string): {
        [x: string]: {};
        where: {};
        select: string;
    };
}
