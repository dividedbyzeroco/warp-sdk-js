// @flow
/**
 * References
 */
import enforce from 'enforce-js';
import _Object from './object';
import Error from '../utils/error';
import { InternalKeys } from '../utils/constants';
import ConstraintMap, { Constraints } from '../utils/constraint-map';
import Collection from '../utils/collection';
import type { IHttpAdapter } from '../types/http';
import type { IStorageAdapter } from '../types/storage';

export default class Query {

    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    _class: typeof _Object;
    _select: Array<string> = [];
    _include: Array<string> = [];
    _where: ConstraintMap = new ConstraintMap();
    _sort: Array<string> = [];
    _skip: number;
    _limit: number;

    constructor(className: typeof _Object | string) {
        // Check if className is a string
        if(typeof className === 'string') {
            // Get the name as a string
            const name: string = className;

            // Extend Warp.Object and use the new className
            this._class = class extends _Object { get className(): string { return name; } };
        }
        // Check if className is a Warp.Object
        else if((new className) instanceof _Object) {
            this._class = className;
        }
        // Throw an error
        else
            throw new Error(Error.Code.ForbiddenOperation, `\`className\` must be a string or a \`Warp.Object\``);
    }

    static initialize(http: IHttpAdapter, storage: IStorageAdapter) {
        this._http = http;
        this._storage = storage;
        return this;
    }

    _set(key: string, constraint: string, value: any) {
        enforce`${{ key }} as a string`;
        this._where.set(key, constraint, value);
        return this;
    }

    equalTo(key: string, value: any): this {
        this._set(key, Constraints.EqualTo, value);
        return this;
    }

    notEqualTo(key: string, value: any): this {
        this._set(key, Constraints.NotEqualTo, value);
        return this;
    }

    greaterThan(key: string, value: any): this {
        this._set(key, Constraints.GreaterThan, value);
        return this;
    }

    greaterThanOrEqualTo(key: string, value: any): this {
        this._set(key, Constraints.GreaterThanOrEqualTo, value);
        return this;
    }

    lessThan(key: string, value: any): this {
        this._set(key, Constraints.LessThan, value);
        return this;
    }

    lessThanOrEqualTo(key: string, value: any): this {
        this._set(key, Constraints.LessThanOrEqualTo, value);
        return this;
    }

    exists(key: string): this {
        this._set(key, Constraints.Exists, true);
        return this;
    }

    doesNotExist(key: string): this {
        this._set(key, Constraints.Exists, false);
        return this;
    }

    containedIn(key: string, value: Array<any>): this {
        this._set(key, Constraints.ContainedIn, value);
        return this;
    }

    notContainedIn(key: string, value: Array<any>): this {
        this._set(key, Constraints.NotContainedIn, value);
        return this;
    }

    containedInOrDoesNotExist(key: string, value: Array<any>): this {
        this._set(key, Constraints.ContainedInOrDoesNotExist, value);
        return this;
    }

    startsWith(key: string, value: string): this {
        this._set(key, Constraints.StartsWith, value);
        return this;
    }

    endsWith(key: string, value: string): this {
        this._set(key, Constraints.EndsWith, value);
        return this;
    }

    contains(key: string, value: string): this {
        this._set(key, Constraints.Contains, value);
        return this;
    }

    containsEither(key: string, value: Array<string>): this {
        this._set(key, Constraints.ContainsEither, value);
        return this;
    }

    containsAll(key: string, value: Array<string>): this {
        this._set(key, Constraints.ContainsAll, value);
        return this;
    }

    // TODO
    foundIn(key: string, value: Object): this {
        this._set(key, Constraints.FoundIn, value);
        return this;
    }

    foundInEither(key: string, value: Object): this {
        this._set(key, Constraints.FoundInEither, value);
        return this;
    }

    foundInAll(key: string, value: Object): this {
        this._set(key, Constraints.FoundInAll, value);
        return this;
    }

    notFoundIn(key: string, value: Object): this {
        this._set(key, Constraints.NotFoundIn, value);
        return this;
    }

    notFoundInEither(key: string, value: Object): this {
        this._set(key, Constraints.NotFoundInEither, value);
        return this;
    }

    select(...keys: Array<string>): this {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'Select key must be a string or an array of strings');
        const keyList = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._select.push(key);
        }

        return this;
    }

    include(...keys: Array<string>): this {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'Include key must be a string or an array of strings');
        const keyList = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._include.push(key);
        }
        return this;
    }

    sortBy(...keys: Array<string>) {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'SortBy key must be a string or an array of strings');
        const keyList = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._sort.push(key);
        }
        return this;
    }

    sortByDescending(...keys: Array<string>) {
        // Check if first key is an array
        if(!keys) throw new Error(Error.Code.MissingConfiguration, 'SortByDescending key must be a string or an array of strings');
        const keyList = keys[0] instanceof Array? keys[0] : keys;

        // Loop through the keys
        for(let key of keyList) {
            enforce`${{key}} as a string`;
            this._sort.push(`-${key}`);
        }
        return this;
    }

    skip(value: number) {
        enforce`${{ skip: value }} as a number`;
        this._skip = value;
        return this;
    }

    limit(value: number) {
        enforce`${{ limit: value }} as a number`;
        this._limit = value;
        return this;
    }

    async find(callback?: (result: Collection) => Promise<any>): Promise<Collection> {
        // Prepare params
        const sessionToken = this.constructor._storage.get(InternalKeys.Auth.SessionToken);
        const className = this._class.prototype.className;
        const select = this._select.length > 0? this._select : undefined;
        const include = this._include.length > 0? this._include : undefined;
        const where = this._where.toJSON();
        const sort = this._sort.length > 0? this._sort : undefined;
        const skip = this._skip;
        const limit = this._limit;

        // Find objects
        const result = await this.constructor._http.find({ 
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
        const objects = [];
        for(let data of result) {
            // Get the object id
            let id = data[InternalKeys.Id];
            delete data[InternalKeys.Id];

            // Create a new object
            let objectClass = this._class;
            let object = new objectClass(data);

            // Automatically set the id and isDirty flag
            object._id = id;
            object._isDirty = false;

            // Push the object
            objects.push(object);
        }

        // Get collection
        const collection = new Collection(objects);

        // If callback is provided, use callback
        if(typeof callback === 'function') {
            const next = callback(collection);
            return await next;
        }

        // Return the objects
        return collection;
    }

    async first(callback?: (result: _Object | null) => Promise<any>): Promise<_Object | null> {
        // Prepare params
        this._skip = 0;
        this._limit = 1;

        // Find objects
        const result: Collection = await this.find();

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

    async get(id: number): Promise<_Object> {
        // Prepare params
        const sessionToken = this.constructor._storage.get(InternalKeys.Auth.SessionToken);
        const className = this._class.prototype.className;
        const select = this._select.length > 0? this._select : undefined;
        const include = this._include.length > 0? this._include : undefined;

        // Find object
        const object = await this.constructor._http.get({ 
            sessionToken, 
            className, 
            select, 
            include,
            id
        });

        // Return the object
        return object;
    }
}