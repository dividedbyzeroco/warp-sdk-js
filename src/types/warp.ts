import { IWarpServer } from 'warp-server/typings/types/api';
import { UserClass } from 'warp-server/typings/classes/user';
import _Object from '../classes/object';
import Query from '../classes/query';
import User from '../classes/user';
import _Function from '../classes/function';
import Collection from '../utils/collection';
import { IHttpAdapter } from '../types/http';
import { IStorageAdapter } from '../types/storage';

export type WarpOptionsType = {
    apiKey: string,
    masterKey?: string,
    serverURL?: string,
    api?: IWarpServer,
    sessionToken?: string,
    currentUser?: UserClass,
    platform?: string,
    timeout?: number,
    maxRequests?: number,
    supportLegacy?: boolean
}

export interface IWarp {
    /**
     * Private properties
     */
    _http: IHttpAdapter;
    _storage: IStorageAdapter;
    _supportLegacy: boolean;
    _collection: typeof Collection;
    _object: typeof _Object;
    _query: typeof Query;
    _user: typeof User;
    _function: typeof _Function;
    readonly Object: typeof _Object;
    readonly Query: typeof Query;
    readonly User: typeof User;
    readonly Collection: typeof Collection;
    readonly Function: typeof _Function;
}

export declare const IWarp: {
    new(options: WarpOptionsType): IWarp;
}