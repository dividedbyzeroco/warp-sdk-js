// @flow
/**
 * References
 */
import Error from '../../../utils/error';
import { InternalKeys } from '../../../utils/constants';
import type { 
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

    _api: Object;
    _sessionToken: string | void;
    _currentUser: Object | void;

    constructor(config: HttpConfigType): void {
        // Get params
        const { api, sessionToken, currentUser }  = config;

        if(typeof api === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, '`api` must be provided for the api platform');

        // Set api, sessionToken and currentUser
        this._api = api;
        this._sessionToken = sessionToken;
        this._currentUser = currentUser;
    }

    async logIn({ username, email, password }: LogInOptionsType): Promise<Object> {
        // Log in
        let result: Object = (await this._api._userController.logIn({ username, email, password })).toJSON();
        
        // Return result
        return result;
    }

    async become({ sessionToken }: BecomeOptionsType): Promise<Object> {
        // Get current user
        const currentUser = this._getCurrentUser(sessionToken);

        // Fetch current user
        let result: Object = (await this._api._userController.me({ currentUser })).toJSON();
        
        // Return result
        return result;
    }

    async logOut({ sessionToken }: LogOutOptionsType): Promise<Object> {
        // Get current user
        const currentUser = this._getCurrentUser(sessionToken);
        
        // Log out
        let result: Object = (await this._api._userController.logOut({ currentUser })).toJSON();
        
        // Return result
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
    }: FindOptionsType): Promise<Array<Object>> {
        // Fetch objects
        let result: Array<Object>;
        if(className === InternalKeys.Auth.User) 
            result = (await this._api._userController.find({ select, include, where, sort, skip, limit })).toJSON();
        else if(className === InternalKeys.Auth.Session) 
            result = (await this._api._sessionController.find({ select, include, where, sort, skip, limit })).toJSON();
        else
            result = (await this._api._classController.find({ className, select, include, where, sort, skip, limit })).toJSON();
        
        // Return result
        return result;
    }

    async get({ className, id, select, include }: GetOptionsType): Promise<Object> {
        // Get object
        let result: Array<Object>;
        if(className === InternalKeys.Auth.User) 
            result = (await this._api._userController.get({ select, include, id })).toJSON();
        else if(className === InternalKeys.Auth.Session) 
            result = (await this._api._sessionController.get({ select, include, id })).toJSON();
        else
            result = (await this._api._classController.get({ className, select, include, id })).toJSON();
        
        // Return result
        return result;
    }

    async save({ sessionToken, className, keys, id }: SaveOptionsType): Promise<Object> {
        // Get current user
        const currentUser = this._getCurrentUser(sessionToken);
        
        // Prepare metadata
        const metadata = { isMaster: true };

        // Save objects
        let result: Array<Object>;

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

    async destroy({ sessionToken, className, id }: DestroyOptionsType): Promise<Object> {
        // Get current user
        const currentUser = this._getCurrentUser(sessionToken);
        
        // Prepare metadata
        const metadata = { isMaster: true };
        
        // Destroy object
        let result: Array<Object>;
        if(className === InternalKeys.Auth.User) 
            result = (await this._api._userController.destroy({ metadata, currentUser, id })).toJSON();
        else
            result = (await this._api._classController.destroy({ metadata, currentUser, className, id })).toJSON();
        
        // Return result
        return result;
    }

    async run({ sessionToken, functionName, keys }: RunOptionsType): Promise<any> {
        // Get current user
        const currentUser = this._getCurrentUser(sessionToken);

        // Destroy object
        let result: Array<Object> = (await this._api.functionController.run({ currentUser, functionName, keys })).toJSON();
        
        // Return result
        return result;
    }    

    async _getCurrentUser(sessionToken: string | void) {
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