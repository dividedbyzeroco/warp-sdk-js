// @flow
/**
 * References
 */
import enforce from 'enforce-js';
import Error from '../utils/error';
import { InternalKeys } from '../utils/constants';
import KeyMap from '../utils/key-map';
import { toCamelCase } from '../utils/format';
import type { IHttpAdapter } from '../types/http';
import type { IStorageAdapter } from '../types/storage';
import type { JsonFunctionsType } from '../types/object';

export default class _Object {

    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    static _supportLegacy: boolean = false;
    _className: string;
    _id: number;
    _createdAt: string;
    _updatedAt: string;
    _keyMap: KeyMap = new KeyMap();
    _isDirty: boolean = false;
    _isPointer: boolean;

    constructor(...args: Array<any>) {
        if(args.length > 0) {
            if(typeof args[0] === 'string') {
                if(typeof this.className !== 'undefined')
                    throw new Error(Error.Code.ForbiddenOperation, `A className has already been defined for the Warp Object`);

                // Set className
                this._className = args[0];
    
                // Set keys
                if(args.length > 1 && typeof args[1] === 'object' && args[1] !== null) {
                    const keys: {[name: string]: any} = args[1];
                    this._keyMap = new KeyMap(keys);
                    this._isDirty = true;
                }
            }
            else if(typeof args[0] === 'object' && args[1] !== null) {
                // Check if the class is a subclass
                if(typeof this.className === 'undefined')
                    throw new Error(Error.Code.MissingConfiguration, `Only extended Warp Objects can have keys as the first argument`);
    
                // Set keys
                const keys: {[name: string]: any} = args[0];
                this._keyMap = new KeyMap(keys);
                this._isDirty = true;
            }
        }
        else if(typeof this.className === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, `The parameters for Warp Object are invalid`);
    }

    static initialize(http: IHttpAdapter, storage: IStorageAdapter, supportLegacy: boolean): any {
        this._http = http;
        this._storage = storage;
        this._supportLegacy = supportLegacy;
        return this;
    }

    static createWithoutData(id: number, className?: string) {
        const object = new this(className);
        object._id = id;
        return object;
    }

    static toObject(value: Object): this {
        const { id, attributes } = value;
        const object = this.createWithoutData(id);

        // If attributes exist, store in keyMap
        if(typeof attributes !== 'undefined') {
            object._keyMap = new KeyMap(attributes);
        }

        return object;
    }

    static pointerIsImplementedBy(value: Object) {
        if(value === null) return false;
        if(typeof value !== 'object') return false;
        if(value.type !== 'Pointer') return false;
        if(value.id <= 0) return false;
        return true;
    }

    static specialsIsImplementedBy(value: Object) {
        if(value === null) return false;
        if(typeof value !== 'object') return false;
        if(typeof value.type === 'undefined') return false;
        return true;
    }

    get className(): string {
        return this._className;
    }

    /**
     * Generic setter for all keys
     * @param {String} key 
     * @param {*} value 
     */
    set(key: string, value: any) {
        // Check the key
        if(InternalKeys.Id === key 
            || InternalKeys.CreatedAt === key 
            || InternalKeys.UpdatedAt === key
            || InternalKeys.DeletedAt === key) {
            // If it is an internal key
            throw new Error(Error.Code.ForbiddenOperation, `Cannot manually set \`${key}\` because it is an internal key`);
        }
        else if(typeof value === 'object' && value !== null && value instanceof _Object) {
            // Check if id exists
            if(value.id <= 0) {
                throw new Error(Error.Code.ForbiddenOperation, `Cannot set \`${key}\` as a pointer because it is unsaved, please save it before using`);
            }

            // Set to pointer
            this._keyMap.set(key, value.toPointer().toJSON());
        }
        else this._keyMap.set(key, value);

        // Flag data as dirty/unsaved
        this._isDirty = true;
    }

    /**
     * Generic getter for all keys
     * @param {String} key 
     * @param {*} value 
     */
    get(key: string): any {
        // Check the key
        if(InternalKeys.Id === key 
            || InternalKeys.CreatedAt === key 
            || InternalKeys.UpdatedAt === key
            || InternalKeys.DeletedAt === key) {
            // If it is an internal key
            throw new Error(Error.Code.ForbiddenOperation, `Cannot manually get \`${key}\` because it is an internal key`);
        }
        
        // Get value
        const value = this._keyMap.get(key);

        // If the value is for a pointer, return a new object
        if(this.constructor.pointerIsImplementedBy(value)) {
            return this.constructor.toObject(value);
        }
        else if(this.constructor.specialsIsImplementedBy(value)) {
            return undefined;
        }
        // Otherwise, get the KeyMap value
        else return value;
    }

    increment(key: string, value: number) {
        // Enforce 
        enforce`${{value}} as a number`;

        // Set the value to an increment object
        const increment = { type: 'Increment', value };
        this._keyMap.set(key, increment);
    }

    json(key: string): JsonFunctionsType {
        const keyMap = this._keyMap;

        return {
            set: (path: string, value: Object) => {
                // Enforce
                enforce`${{path}} as a string`;
        
                // Set the value to a SetJSON object
                const setJSON = { type: 'SetJson', path, value };
                keyMap.set(key, setJSON);
            },
            append: (path: string, value: Object | Array<any>) => {
                // Enforce
                enforce`${{path}} as a string`;
        
                // Set the value to a SetJSON object
                const setJSON = { type: 'AppendJson', path, value };
                keyMap.set(key, setJSON);
            }
        };
    }

    get id(): number {
        return this._id;
    }

    get createdAt(): string {
        return this._keyMap.get(InternalKeys.Timestamps.CreatedAt);
    }

    get updatedAt(): string {
        return this._keyMap.get(InternalKeys.Timestamps.UpdatedAt);
    }

    get deletedAt(): string {
        return this._keyMap.get(InternalKeys.Timestamps.DeletedAt);
    }

    async save(): Promise<this> {
        // Check if data is dirty/unsaved
        if(!this._isDirty) return this;

        // Prepare params
        const sessionToken = this.constructor._storage.get(InternalKeys.Auth.SessionToken);
        const className = this.className;
        const keys = this._keyMap.toJSON();
        const id = this.id;

        const result = await this.constructor._http.save({ sessionToken, className, keys, id });

        const keyMap = new KeyMap(result);
        keyMap.remove(InternalKeys.Id);
        this._keyMap = keyMap;

        // Flag data as clean/saved
        this._isDirty = false;

        return this;
    }

    async destroy(): Promise<this> {
        // Prepare params
        const sessionToken = this.constructor._storage.get(InternalKeys.Auth.SessionToken);
        const className = this.className;
        const id = this.id;

        if(typeof id === 'undefined') {
            throw new Error(Error.Code.ForbiddenOperation, 'Cannot destroy an unsaved object');
        }

        const result = await this.constructor._http.destroy({ sessionToken, className, id });

        const keyMap = new KeyMap(result);
        keyMap.remove(InternalKeys.Id);
        this._keyMap = keyMap;

        // Flag data as clean/saved
        this._isDirty = false;

        return this;
    }

    async fetch() {
        // Prepare params
        const sessionToken = this.constructor._storage.get('sessionToken');
        const className = this.className;
        const id = this.id;
        
        const result = await this.constructor._http.get({ sessionToken, className, id });

        const keyMap = new KeyMap(result);
        keyMap.remove(InternalKeys.Id);
        this._keyMap = keyMap;

        return this;
    }

    toPointer(): this {
        this._isPointer = true;
        return this;
    }

    toJSON(): Object {
        // Get keys
        const { id, createdAt, updatedAt } = this;
        let keys = {};

        // If object is a pointer, omit keys
        if(this._isPointer) 
            keys = { 
                type: 'Pointer',
                [this.constructor._supportLegacy? InternalKeys.Pointers.LegacyClassName
                    : InternalKeys.Pointers.ClassName]: this.className
            };
        else {
            // Iterate through each key in key map
            for(let key of this._keyMap.getAliases()) {
                // If the key is a timestamp, skip it
                if(InternalKeys.Timestamps.CreatedAt === key 
                    || InternalKeys.Timestamps.UpdatedAt === key
                    || InternalKeys.Timestamps.DeletedAt === key)
                    continue;

                // Get the key descriptor
                const keyDescriptor = Object.getOwnPropertyDescriptor(this.constructor.prototype, toCamelCase(key));

                // Check if key descriptor exists
                if(keyDescriptor && typeof keyDescriptor['get'] === 'function') {
                    const getter = keyDescriptor['get'].bind(this);
                    keys[key] = getter();
                }
                else
                    keys[key] = this.get(key);
            }
        }

        // Return the object
        return {
            [InternalKeys.Id]: id,
            ...keys,
            [InternalKeys.Timestamps.CreatedAt]: createdAt,
            [InternalKeys.Timestamps.UpdatedAt]: updatedAt
        };
    }
}