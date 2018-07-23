import { _Object } from './classes/object';
import { Query } from './classes/query';
import { User } from './classes/user';
import { _Function } from './classes/function';
import Collection from './utils/collection';
import { IHttpAdapter } from './types/http';
import { IStorageAdapter } from './types/storage';
import { WarpOptionsType, IWarp } from './types/warp';
declare class Warp implements IWarp {
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
    constructor({ platform, apiKey, masterKey, serverURL, api, sessionToken, currentUser, timeout, maxRequests, supportLegacy }: WarpOptionsType);
    readonly Object: typeof _Object;
    readonly Query: typeof Query;
    readonly User: typeof User;
    readonly Collection: typeof Collection;
    readonly Function: typeof _Function;
}
export default class _Warp {
    static _instance: Warp;
    static readonly instance: Warp;
    static initialize(options: WarpOptionsType): void;
    static readonly Object: typeof _Object;
    static readonly Query: typeof Query;
    static readonly User: typeof User;
    static readonly Collection: typeof Collection;
    static readonly Function: typeof _Function;
    static extend(options: WarpOptionsType): Warp;
}
export { Warp };
