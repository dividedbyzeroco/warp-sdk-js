import KeyMap from '../utils/key-map';
import { IHttpAdapter } from '../types/http';
import { IStorageAdapter } from '../types/storage';
import { JsonFunctionsType } from '../types/object';
export declare class _Object {
    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    static _supportLegacy: boolean;
    _className: string;
    _id: number;
    _createdAt: string;
    _updatedAt: string;
    _keyMap: KeyMap;
    _isDirty: boolean;
    _isPointer: boolean;
    constructor(...args: Array<any>);
    /**
     * Initialize the object
     * @param {IHttpAdapter} http
     * @param {IStorageAdapter} storage
     * @param {Boolean} supportLegacy
     */
    static initialize<T extends typeof _Object>(http: IHttpAdapter, storage: IStorageAdapter, supportLegacy: boolean): T;
    /**
     * Create a new Obejct with only the Id
     * @param {Number} id
     * @param {String} className
     */
    static fromId(id: number, className?: string): _Object;
    /**
     * Alias of fromId
     */
    static createWithoutData(id: number, className?: string): _Object;
    /**
     * Convert an API Pointer to an Object
     * @param {Object} value
     */
    static toObject(value: {
        id: number;
        attributes: object;
    }): _Object;
    /**
     * Check if the provided value implements proper pointer definition
     * @param {Object} value
     */
    static pointerIsImplementedBy(value: object): boolean;
    /**
     * Check if the value implements proper specials definition
     * @param {Object} value
     */
    static specialsIsImplementedBy(value: Object): boolean;
    statics<T extends typeof _Object>(): T;
    /**
     * Get the className
     */
    readonly className: string;
    /**
     * Sets all the keys provided
     * @param {Object} keys
     */
    _setKeys(keys: {
        [name: string]: any;
    }): void;
    /**
     * Generic setter for all keys
     * @param {String} key
     * @param {*} value
     */
    set(key: string, value: any): void;
    /**
     * Generic getter for all keys
     * @param {String} key
     * @param {*} value
     */
    get(key: string): any;
    /**
     * Atomically increase a key
     * @param {String} key
     * @param {Number} value
     */
    increment(key: string, value: number): void;
    /**
     * Perform JSON operations on the key
     * > NOTE: This is only applicable for MySQL 5.7 and up
     * @param {String} key
     */
    json(key: string): JsonFunctionsType;
    /**
     * Get Id
     */
    readonly id: number;
    /**
     * Get CreatedAt
     */
    readonly createdAt: string;
    /**
     * Get UpdatedAt
     */
    readonly updatedAt: string;
    /**
     * Get DeletedAt
     */
    readonly deletedAt: string;
    /**
     * Save the Object
     */
    save(): Promise<this>;
    /**
     * Destroy the Object
     */
    destroy(): Promise<this>;
    /**
     * Fetch the latest copy of the Object
     */
    fetch(): Promise<this>;
    /**
     * Set the Pointer flag
     */
    toPointer(): this;
    /**
     * Convert Object into an object literal
     */
    toJSON(): Object;
}
