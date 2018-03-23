import enforce from 'enforce-js';
import _Object from './classes/object';
import Query from './classes/query';
import User from './classes/user';
import _Function from './classes/function';
import Http from './adapters/http';
import Storage from './adapters/storage';
import Collection from './utils/collection';
import Error from './utils/error';
import { InternalKeys } from './utils/constants';
import { IHttpAdapter } from './types/http';
import { IStorageAdapter } from './types/storage';
import { WarpOptionsType } from './types/warp';

class Warp {
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

    constructor({ 
        platform = 'browser', 
        apiKey, masterKey, serverURL, 
        api, sessionToken, currentUser,
        timeout = 10, maxRequests = 6, supportLegacy = false 
    }: WarpOptionsType) {
        
        // If platform is 'browser'
        if(platform === 'browser') {
            // Enforce
            enforce`${{apiKey}} as a string`;
            enforce`${{apiKey}} as an optional string`;
            enforce`${{timeout}} as an optional number`;
            enforce`${{maxRequests}} as an optional number`;

            if(typeof serverURL !== 'string')
                throw new Error(Error.Code.MissingConfiguration, '`serverURL` must be a string');

            // Modify serverURL to remove trailing slash
            if(serverURL[serverURL.length - 1] === '/')
                serverURL = serverURL.slice(0, serverURL.length - 2);

            // Set http
            this._http = Http.use('browser', { apiKey, masterKey, serverURL, timeout, maxRequests });

            // Set storage
            this._storage = Storage.use('browser', { prefix: serverURL });
        }

        // If platform is 'api'
        if(platform === 'api') {
            if(typeof api === 'undefined')
                throw new Error(Error.Code.MissingConfiguration, '`api` must be provided when using the api platform');

            // Set http
            this._http = Http.use('api', { api, sessionToken, currentUser });

            // Set storage
            this._storage = Storage.use('api', { prefix: api.apiKey });

            // Set session token and currentUser
            if(typeof sessionToken !== 'undefined') this._storage.set(InternalKeys.Auth.SessionToken, sessionToken);
            if(typeof currentUser !== 'undefined') this._storage.set(InternalKeys.Auth.User, JSON.stringify(currentUser.toJSON()));
        }

        // Set legacy support
        this._supportLegacy = supportLegacy;

        // Extend the object to allow for multiple instances of http and storage
        // Initialize the object
        const _object = class extends _Object {};
        this._object = _object.initialize(this._http, this._storage, this._supportLegacy);

        // Extend the query to allow for multiple instances of http and storage
        // Initialize the query
        const query = class extends Query<_Object> {};
        this._query = query.initialize(this._http, this._storage);

        // Extend the user to allow for multiple instances of http and storage
        const user = class extends User {};
        this._user = user.initialize(this._http, this._storage, this._supportLegacy);

        // Extend the function to allow for multiple instances of http and storage
        // Initialize the function
        const _function = class extends _Function {};
        this._function = _function.initialize(this._http, this._storage);
    }

    get Object(): typeof _Object {
        return this._object;
    }

    get Query(): typeof Query {
        return this._query;
    }

    get User(): typeof User {
        return this._user;
    }

    get Collection(): typeof Collection {
        return this._collection;
    }

    get Function(): typeof _Function {
        return this._function;
    }
}

export default class _Warp {

    static _instance: Warp;

    static get instance(): Warp {
        if(typeof this._instance === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, 'Warp must be initialized before it is used');

        return this._instance;
    }

    static initialize(options: WarpOptionsType) {
        this._instance = new Warp(options);
    }

    static get Object(): typeof _Object {
        return this.instance.Object;
    }

    static get Query(): typeof Query {
        return this.instance.Query;
    }

    static get User(): typeof User {
        return this.instance.User;
    }

    static get Collection(): typeof Collection {
        return this.instance.Collection; 
    }

    static get Function(): typeof _Function {
        return this.instance.Function;
    }

    static extend(options: WarpOptionsType) {
        return new Warp(options);
    }
}

export {
    Warp
};

// Attach Warp to the window if used in a browser
if(typeof window !== 'undefined') window['Warp'] = _Warp;