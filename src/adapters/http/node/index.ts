import fetch from 'node-fetch';
import Error from '../../../utils/error';
import Queue from '../../../utils/queue';
import { InternalKeys } from '../../../utils/constants';
import { 
    IHttpAdapter, 
    HttpConfigType,
    LogInOptionsType,
    BecomeOptionsType,
    LogOutOptionsType, 
    FindOptionsType,
    GetOptionsType,
    SaveOptionsType,
    DestroyOptionsType,
    RunOptionsType
} from '../../../types/http';

 export default class NodeHTTPAdapter implements IHttpAdapter {

    _apiKey: string;
    _masterKey?: string;
    _serverURL: string;
    _requestInterval: number = 200;
    _queue: Queue;

    constructor(config: HttpConfigType) {
        // Get params
        const { apiKey, masterKey, serverURL, timeout, maxRequests }  = config;

        // Set key and url
        this._apiKey = apiKey || '';
        this._masterKey = masterKey;
        this._serverURL = serverURL || '';
        this._queue = new Queue(maxRequests || 6, this._requestInterval, timeout || 10);
    }

    async logIn({ username, email, password }: LogInOptionsType): Promise<object> {
        // Prepare url
        let url: string = `${this._serverURL}/login`;

        // Prepare keys
        const keys = {
            username,
            email,
            password
        };

        // Log in
        const request = this._send(url, 'POST', undefined, keys);
        const result: object = await this._queue.push(request);
        return result;
    }

    async become({ sessionToken }: BecomeOptionsType): Promise<object> {
        // Prepare url
        let url: string = `${this._serverURL}/users/me`;

        // Become session
        const request = this._send(url, 'GET', sessionToken);
        const result: object = await this._queue.push(request);
        return result;
    }

    async logOut({ sessionToken }: LogOutOptionsType): Promise<object> {
        // Prepare url
        let url: string = `${this._serverURL}/logout`;

        // Log out
        const request = this._send(url, 'POST', sessionToken);
        const result: object = await this._queue.push(request);
        return result;
    }

    async find({ 
        className, 
        select, 
        include, 
        where, 
        sort, 
        skip, 
        limit 
    }: FindOptionsType): Promise<Array<object>> {
        // Prepare url
        let url: string = `${this._serverURL}/classes/${className}?`; 
        const urlParams: Array<string> = [];
        
        // Check if className is for the user or session class
        if(className === InternalKeys.Auth.User)
            url = `${this._serverURL}/users?`;
        else if(className === InternalKeys.Auth.Session)
            url = `${this._serverURL}/sessions?`;

        // Check url params
        if(typeof select !== 'undefined')
            urlParams.push('select=' + encodeURIComponent(JSON.stringify(select)));
        if(typeof include !== 'undefined')
            urlParams.push('include=' + encodeURIComponent(JSON.stringify(include)));
        if(typeof where !== 'undefined')
            urlParams.push('where=' + encodeURIComponent(JSON.stringify(where)));
        if(typeof sort !== 'undefined')
            urlParams.push('sort=' + encodeURIComponent(JSON.stringify(sort)));
        if(typeof skip !== 'undefined')
            urlParams.push(`skip=${skip}`);
        if(typeof limit !== 'undefined')
            urlParams.push(`limit=${limit}`);

        // Add the url params
        url += urlParams.join('&');

        // Fetch objects
        const request = this._send(url, 'GET');
        const result: Array<object> = await this._queue.push(request);
        return result;
    }

    async get({ className, id, select, include }: GetOptionsType): Promise<object> {
        // Prepare url
        let url: string = `${this._serverURL}/classes/${className}/${id}?`; 
        const urlParams: Array<string> = [];
        
        // Check if className is for the user or session class
        if(className === InternalKeys.Auth.User)
            url = `${this._serverURL}/users/${id}?`;
        else if(className === InternalKeys.Auth.Session)
            url = `${this._serverURL}/sessions/${id}?`;

        // Check url params
        if(typeof select !== 'undefined')
            urlParams.push('select=' + encodeURIComponent(JSON.stringify(select)));
        if(typeof include !== 'undefined')
            urlParams.push('include=' + encodeURIComponent(JSON.stringify(include)));
        
        // Add the url params
        url += urlParams.join('&');

        // Fetch object
        const request = this._send(url, 'GET');
        const result: object = await this._queue.push(request);
        return result;
    }

    async save({ sessionToken, className, keys, id }: SaveOptionsType): Promise<object> {
        // Prepare url
        let url: string = `${this._serverURL}/classes/${className}`;

        // Check if className is for the user or session class
        if(className === InternalKeys.Auth.User)
            url = `${this._serverURL}/users`;

        // If id is given, append it to the url
        if(typeof id !== 'undefined') url += `/${id}`;

        // Prepare method
        const method = typeof id === 'undefined' ? 'POST' : 'PUT';

        // Save object
        const request = this._send(url, method, sessionToken, keys);
        const result: object = await this._queue.push(request);
        return result;
    }

    async destroy({ sessionToken, className, id }: DestroyOptionsType): Promise<object> {
        // Prepare url
        let url: string = `${this._serverURL}/classes/${className}/${id}`;

        // Check if className is for the user or session class
        if(className === InternalKeys.Auth.User)
            url = `${this._serverURL}/users`;

        // Destroy object
        const request = this._send(url, 'DELETE', sessionToken);
        const result: object = await this._queue.push(request);
        return result;
    }

    async run({ sessionToken, functionName, keys }: RunOptionsType): Promise<any> {
        // Prepare url
        let url: string = `${this._serverURL}/functions/${functionName}`;

        // Run function
        const request = this._send(url, 'POST', sessionToken, keys);
        const result: any = await this._queue.push(request);
        return result;
    }

    async _send(url: string, method: string, sessionToken?: string, body?: {[name: string]: any}): Promise<Array<object> | object | void> {
        // Prepare headers
        const headers = new Headers();
        headers.append('X-Warp-API-Key', this._apiKey);
        headers.append('Content-Type', method === 'GET' ? 'application/x-www-form-urlencode' : 'application/json');
        
        // Check if master key is provided
        if(typeof this._masterKey === 'string') headers.append('X-Warp-Master-Key', this._masterKey);

        // Check if session token is provided
        if(typeof sessionToken === 'string') headers.append('X-Warp-Session-Token', sessionToken);

        // Prepare fetch options
        const fetchOptions = {
            headers,
            method,
            body: body ? JSON.stringify(body) : undefined
        };

        // Fetch result
        const result = await fetch(url, fetchOptions);

        // Get response body
        const response: {[name: string]: any} = await result.json();

        // Check status
        if(result.status < 200 || result.status >= 400)
            throw new Error(response.code, response.message);
        else
            return response.result;
    }
 }