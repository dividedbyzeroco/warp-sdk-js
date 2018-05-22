import { IHttpAdapter } from '../types/http';
import { IStorageAdapter } from '../types/storage';
export default class _Function {
    static _http: IHttpAdapter;
    static _storage: IStorageAdapter;
    static initialize<T extends typeof _Function>(http: IHttpAdapter, storage: IStorageAdapter): T;
    static run(functionName: string, keys?: {
        [name: string]: any;
    }, callback?: (result: any) => Promise<any>): Promise<any>;
}
