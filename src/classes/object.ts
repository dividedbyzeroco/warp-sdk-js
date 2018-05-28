import enforce from 'enforce-js';
import Error from '../utils/error';
import { InternalKeys } from '../utils/constants';
import KeyMap from '../utils/key-map';
import { toCamelCase, toDatabaseDate } from '../utils/format';
import { IHttpAdapter } from '../types/http';
import { IStorageAdapter } from '../types/storage';
import { JsonFunctionsType } from '../types/object';
import { getPropertyDescriptor } from '../utils/props';
import { Query } from './query';

export class _Object {

    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    static _supportLegacy: boolean = false;
    _className: string;
    _id: number;
    _createdAt: string;
    _updatedAt: string;
    _keyMap: KeyMap = new KeyMap();
    _dirtyKeys: {[name: string]: boolean} = {};
    _isDirty: boolean = false;
    _isPointer: boolean;

    constructor(...args: Array<any>) {
        // If there are arguments
        if(args.length > 0) {
            // If the first argument is a string
            if(typeof args[0] === 'string') {
                // If the className has already been defined
                if(typeof this.className !== 'undefined')
                    throw new Error(Error.Code.ForbiddenOperation, `A className has already been defined for the Warp Object`);

                // Set className
                this._className = args[0];
    
                // Set keys
                if(args.length > 1 && typeof args[1] === 'object' && args[1] !== null) {
                    const keys: {[name: string]: any} = args[1];
                    this._setKeys(keys);
                    this._isDirty = true;
                }
            }
            // If the first argument is an object
            else if(typeof args[0] === 'object' && args[1] !== null) {
                // Check if the class is a subclass
                if(typeof this.className === 'undefined')
                    throw new Error(Error.Code.MissingConfiguration, `Only extended Warp Objects can have keys as the first argument`);
    
                // Set keys
                const keys: {[name: string]: any} = args[0];
                this._setKeys(keys);
                this._isDirty = true;
            }
        }
        // If there are arguments and the className has not been defined
        else if(typeof this.className === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, `The parameters for Warp Object are invalid`);
    }

    /**
     * Initialize the object
     * @param {IHttpAdapter} http 
     * @param {IStorageAdapter} storage 
     * @param {Boolean} supportLegacy 
     */
    static initialize<T extends typeof _Object>(http: IHttpAdapter, storage: IStorageAdapter, supportLegacy: boolean): T {
        this._http = http;
        this._storage = storage;
        this._supportLegacy = supportLegacy;
        return this as T;
    }

    /**
     * Create a new Obejct with only the Id
     * @param {Number} id 
     * @param {String} className 
     */
    static fromId(id: number, className?: string) {
        const object = new this(className);
        object._id = id;
        return object;
    }
    
    /**
     * Alias of fromId
     */
    static createWithoutData(id: number, className?: string) {
        return this.fromId(id, className);
    }

    /**
     * Convert an API Pointer to an Object
     * @param {Object} value 
     */
    static toObject(value: { id: number, attributes: object }) {
        const { id, attributes } = value;
        const object = this.createWithoutData(id);

        // If attributes exist, store in keyMap
        if(typeof attributes !== 'undefined') {
            object._keyMap = new KeyMap(attributes);
        }

        return object;
    }

    /**
     * Check if the provided value implements proper pointer definition
     * @param {Object} value
     */
    static pointerIsImplementedBy(value: object) {
        if(value === null) return false;
        if(typeof value !== 'object') return false;
        if(value['type'] !== 'Pointer') return false;
        if(value['id'] <= 0) return false;
        return true;
    }

    /**
     * Check if the value implements proper specials definition
     * @param {Object} value 
     */
    static specialsIsImplementedBy(value: Object) {
        if(value === null) return false;
        if(typeof value !== 'object') return false;
        if(typeof value['type'] === 'undefined') return false;
        return true;
    }

    statics<T extends typeof _Object>(): T {
        return this.constructor as T;
    }

    /**
     * Get the className
     */
    get className(): string {
        return this._className;
    }

    /**
     * Sets all the keys provided
     * @param {Object} keys 
     */
    _setKeys(keys: {[name: string]: any}) {
        // Loop through the keys
        for(let key in keys) {
            // Set the value using the set method
            this.set(key, keys[key]);
        }
    }

    /**
     * Generic setter for all keys
     * @param {String} key 
     * @param {*} value 
     */
    set(key: string, value: any) {
        // Check the key
        if(InternalKeys.Id === key 
            || InternalKeys.Timestamps.CreatedAt === key 
            || InternalKeys.Timestamps.UpdatedAt === key
            || InternalKeys.Timestamps.DeletedAt === key) {
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
        else if(value instanceof Date) {
            this._keyMap.set(key, toDatabaseDate(value.toISOString()));
        }
        else this._keyMap.set(key, value);

        // Flag data as dirty/unsaved
        this._isDirty = true;

        // Add to dirty keys
        this._dirtyKeys[key] = true;
    }

    /**
     * Generic getter for all keys
     * @param {String} key 
     * @param {*} value 
     */
    get(key: string): any {
        // Check the key
        if(InternalKeys.Id === key 
            || InternalKeys.Timestamps.CreatedAt === key 
            || InternalKeys.Timestamps.UpdatedAt === key
            || InternalKeys.Timestamps.DeletedAt === key) {
            // If it is an internal key
            throw new Error(Error.Code.ForbiddenOperation, `Cannot manually get \`${key}\` because it is an internal key`);
        }
        
        // Get value
        const value = this._keyMap.get(key);

        // If the value is for a pointer, return a new object
        if(this.statics().pointerIsImplementedBy(value)) {
            return this.statics().toObject(value);
        }
        else if(this.statics().specialsIsImplementedBy(value)) {
            return undefined;
        }
        // Otherwise, get the KeyMap value
        else return value;
    }

    /**
     * Atomically increase a key
     * @param {String} key
     * @param {Number} value
     */
    increment(key: string, value: number) {
        // Enforce 
        enforce`${{value}} as a number`;

        // Set the value to an increment object
        const increment = { type: 'Increment', value };
        this._keyMap.set(key, increment);
    }

    /**
     * Perform JSON operations on the key
     * > NOTE: This is only applicable for MySQL 5.7 and up
     * @param {String} key 
     */
    json(key: string): JsonFunctionsType {
        const keyMap = this._keyMap;

        return {
            set: (path: string, value: any) => {
                // Enforce
                enforce`${{path}} as a string`;
        
                // Set the value to a SetJSON object
                const setJSON = { type: 'SetJson', path, value };
                keyMap.set(key, setJSON);
            },
            append: (path: string, value: any) => {
                // Enforce
                enforce`${{path}} as a string`;
        
                // Set the value to a SetJSON object
                const setJSON = { type: 'AppendJson', path, value };
                keyMap.set(key, setJSON);
            }
        };
    }

    /**
     * Get Id
     */
    get id(): number {
        return this._id;
    }

    /**
     * Get CreatedAt
     */
    get createdAt(): string {
        return this._keyMap.get(InternalKeys.Timestamps.CreatedAt);
    }

    /**
     * Get UpdatedAt
     */
    get updatedAt(): string {
        return this._keyMap.get(InternalKeys.Timestamps.UpdatedAt);
    }

    /**
     * Get DeletedAt
     */
    get deletedAt(): string {
        return this._keyMap.get(InternalKeys.Timestamps.DeletedAt);
    }

    /**
     * Save the Object
     */
    async save(): Promise<this> {
        // Check if data is dirty/unsaved
        if(!this._isDirty) return this;

        // Prepare params
        const sessionToken = this.statics()._storage.get(InternalKeys.Auth.SessionToken);
        const className = this.className;
        const currentKeys = this._keyMap.toJSON();
        const id = this.id;
        delete currentKeys[InternalKeys.Timestamps.CreatedAt];
        delete currentKeys[InternalKeys.Timestamps.UpdatedAt];
        delete currentKeys[InternalKeys.Timestamps.DeletedAt];

        // Get dirty keys
        const keys = Object.entries(currentKeys).reduce((map, [key, value]) => {
            if(this._dirtyKeys[key])
                map[key] = value;
            return map;
        }, {});

        // Get result
        const result = await this.statics()._http.save({ sessionToken, className, keys, id });

        // Set Id
        this._id = result[InternalKeys.Id];
        delete result[InternalKeys.Id]

        // Set new keyMap values
        for(let [key, value] of Object.entries(result))
            this._keyMap.set(key, value);

        // Flag data as clean/saved
        this._isDirty = false;
        this._dirtyKeys = {};

        return this;
    }

    /**
     * Destroy the Object
     */
    async destroy(): Promise<this> {
        // Prepare params
        const sessionToken = this.statics()._storage.get(InternalKeys.Auth.SessionToken);
        const className = this.className;
        const id = this.id;

        if(typeof id === 'undefined') {
            throw new Error(Error.Code.ForbiddenOperation, 'Cannot destroy an unsaved object');
        }

        const result = await this.statics()._http.destroy({ sessionToken, className, id });

        const keyMap = new KeyMap(result);
        keyMap.remove(InternalKeys.Id);
        this._keyMap = keyMap;

        // Flag data as clean/saved
        this._isDirty = false;
        this._dirtyKeys = {};

        return this;
    }

    /**
     * Fetch the latest copy of the Object
     */
    async fetch() {
        // Prepare params
        const sessionToken = this.statics()._storage.get('sessionToken');
        const className = this.className;
        const id = this.id;
        
        const result = await this.statics()._http.get({ sessionToken, className, id });

        const keyMap = new KeyMap(result);
        keyMap.remove(InternalKeys.Id);
        this._keyMap = keyMap;

        return this;
    }

    /**
     * Set the Pointer flag
     */
    toPointer(): this {
        this._isPointer = true;
        return this;
    }

    /**
     * Convert Object into an object literal
     */
    toJSON(): Object {
        // Get keys
        const { id, createdAt, updatedAt } = this;
        let keys = {};

        // If object is a pointer, omit keys
        if(this._isPointer) 
            keys = { 
                type: 'Pointer',
                [this.statics()._supportLegacy? InternalKeys.Pointers.LegacyClassName
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
                const keyDescriptor = getPropertyDescriptor(this, toCamelCase(key));

                // Check if key descriptor exists
                if(keyDescriptor && typeof keyDescriptor.get === 'function') {
                    const getter = keyDescriptor.get.bind(this);
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