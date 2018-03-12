// @flow
/**
 * References
 */
import enforce from 'enforce-js';
import { InternalKeys } from '../utils/constants';
import type { IHttpAdapter } from '../types/http';
import type { IStorageAdapter } from '../types/storage';

export default class _Function {

    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;

    static initialize(http: IHttpAdapter, storage: IStorageAdapter): any {
        this._http = http;
        this._storage = storage;
        return this;
    }

    static async run(functionName: string, keys?: {[name: string]: any}, callback: (result: any) => Promise<any>): any {
        // Enforce
        enforce`${{functionName}} as a string`;
        enforce`${{keys}} as an optional object`;

        // Get session token
        const sessionToken = this._storage.get(InternalKeys.Auth.SessionToken);

        // Run the function
        const result = await this._http.run({ sessionToken, functionName, keys });

        // Check if callback is a function
        if(typeof callback === 'function') {
            return await callback(result);
        }

        // Else, return the result directly
        return result;
    }
}