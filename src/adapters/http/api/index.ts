import IWarpServer from 'warp-server';
import { UserClass } from 'warp-server/dist/classes/user';
import { Warp } from '../../../index';
import Error from '../../../utils/error';
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

 export default class APIHttpAdapter implements IHttpAdapter {

    _api: IWarpServer;
    _sessionToken: string | undefined;
    _currentUser: UserClass | undefined;

    constructor(config: HttpConfigType) {
        // Get params
        const { api, sessionToken, currentUser }  = config;

        if(typeof api === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, '`api` must be provided for the api platform');

        // Set api, sessionToken and currentUser
        this._api = api;
        this._sessionToken = sessionToken;
        this._currentUser = currentUser;
    }

    get metadata() {
        // Prepare metadata
        const metadata = {
            client: 'JavaScript',
            sdkVersion: require('../../../../package.json').version,
            isMaster: true
        };

        return metadata;
    }

    getWarp(sessionToken?: string, currentUser?: UserClass) {
        const apiKey = this._api.apiKey;
        const api = this._api
        return new Warp({ platform: 'api', apiKey, api, sessionToken, currentUser });
    }

    async logIn({ username, email, password }: LogInOptionsType): Promise<object> {
        // Get metadata
        const metadata = this.metadata;

        // Log in
        let result: Object = (await this._api._userController.logIn({ metadata, username, email, password })).toJSON();
        
        // Return result
        return result;
    }

    async become({ sessionToken }: BecomeOptionsType): Promise<object> {
        // Get current user
        const currentUser = await this._getCurrentUser(sessionToken);

        // Fetch current user
        let result: object = (await this._api._userController.me({ currentUser })).toJSON();
        
        // Return result
        return result;
    }

    async logOut({ sessionToken }: LogOutOptionsType): Promise<object> {
        // Get current user
        const currentUser = await this._getCurrentUser(sessionToken);

        // Get Warp
        const _Warp = this.getWarp(sessionToken, currentUser);
        
        // Log out
        //let result: Object = (await this._api._userController.logOut({ Warp: _Warp, sessionToken })).toJSON();
        
        // Return result
        return {};
    }

    async find({
        className, 
        select = [], 
        include = [], 
        where = {}, 
        sort, 
        skip = 0, 
        limit = 100 
    }: FindOptionsType): Promise<Array<object>> {
        // Fetch objects
        let result: Array<object>;
        if(className === InternalKeys.Auth.User) 
            result = (await this._api._userController.find({ select, include, where, sort, skip, limit })).toJSON();
        else if(className === InternalKeys.Auth.Session) 
            result = (await this._api._sessionController.find({ select, include, where, sort, skip, limit })).toJSON();
        else
            result = (await this._api._classController.find({ className, select, include, where, sort, skip, limit })).toJSON();
        
        // Return result
        return result;
    }

    async get({ className, id, select, include }: GetOptionsType): Promise<object> {
        // Get object
        let result: object;
        if(className === InternalKeys.Auth.User) 
            result = (await this._api._userController.get({ select, include, id })).toJSON();
        else if(className === InternalKeys.Auth.Session) 
            result = (await this._api._sessionController.get({ select, include, id })).toJSON();
        else
            result = (await this._api._classController.get({ className, select, include, id })).toJSON();
        
        // Return result
        return result;
    }

    async save({ sessionToken, className, keys, id }: SaveOptionsType): Promise<object> {
        // Get current user
        const currentUser = await this._getCurrentUser(sessionToken);
        
        // Prepare metadata
        const metadata = this.metadata;

        // Save objects
        let result: object;

        if(typeof id === 'undefined') {
            if(className === InternalKeys.Auth.User) 
                result = (await this._api._userController.create({ metadata, currentUser, keys })).toJSON();
            else
                result = (await this._api._classController.create({ metadata, currentUser, className, keys })).toJSON();
        }
        else {
            if(className === InternalKeys.Auth.User) 
                result = (await this._api._userController.update({ metadata, currentUser, keys, id })).toJSON();
            else
                result = (await this._api._classController.update({ metadata, currentUser, className, keys, id })).toJSON();
        }
        // Return result
        return result;
    }

    async destroy({ sessionToken, className, id }: DestroyOptionsType): Promise<object> {
        // Get current user
        const currentUser = await this._getCurrentUser(sessionToken);
        
        // Prepare metadata
        const metadata = this.metadata;
        
        // Destroy object
        let result: object;
        if(className === InternalKeys.Auth.User) 
            result = (await this._api._userController.destroy({ metadata, currentUser, id })).toJSON();
        else
            result = (await this._api._classController.destroy({ metadata, currentUser, className, id })).toJSON();
        
        // Return result
        return result;
    }

    async run({ sessionToken, functionName, keys }: RunOptionsType): Promise<any> {
        // Get current user
        const currentUser = await this._getCurrentUser(sessionToken);

        // Prepare metadata
        const metadata = this.metadata;

        // Get Warp
        const _Warp = this.getWarp(sessionToken, currentUser);

        // Destroy object
        //let result: Array<object> = (await this._api._functionController.run({ Warp: _Warp, metadata, currentUser, functionName, keys })).toJSON();
        
        // Return result
        return;
    }    

    async _getCurrentUser(sessionToken: string | undefined) {
        // Check if session token changed
        if(this._sessionToken === sessionToken)
            return this._currentUser;
         
        // Otherwise, set the new session token
        if(typeof sessionToken !== 'undefined') {
            this._sessionToken = sessionToken;
            this._currentUser = await this._api.authenticate({ sessionToken });
        }

        // Return the current user
        return this._currentUser;
    }
 }