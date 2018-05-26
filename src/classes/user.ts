import _Object from './object';
import Error from '../utils/error';
import { toDateTime } from '../utils/format';
import { InternalKeys } from '../utils/constants';
import { LogInOptionsType, BecomeOptionsType, LogOutOptionsType } from '../types/http';
import KeyMap from '../utils/key-map';

export default class User extends _Object {

    static _currentUser: User | undefined;

    static _clearSession() {
        this._storage.remove(InternalKeys.Auth.SessionToken);
        this._storage.remove(InternalKeys.Auth.RevokedAt);
        this._storage.remove(InternalKeys.Auth.User);
        this._currentUser = undefined;
    }

    static current<T extends User>(): T | undefined {
        // If current user is undefined
        if(typeof this._currentUser === 'undefined') {
            // Get revokedAt and user
            const revokedAt = this._storage.get(InternalKeys.Auth.RevokedAt);
            const storedUser = this._storage.get(InternalKeys.Auth.User);
            const revokedAtDate = typeof revokedAt !== 'undefined' && toDateTime(revokedAt);
            
            // Check if session expired
            if(revokedAtDate && revokedAtDate.getTime() < toDateTime().getTime()) {
                this._clearSession();
                throw new Error(Error.Code.InvalidSessionToken, 'Session expired. Try logging in again.');
            }

            // If stored user exists
            if(typeof storedUser !== 'undefined') {
                try {
                    // Get parsed user
                    const parsedUser = JSON.parse(storedUser);
                    const id = parsedUser[InternalKeys.Id];
                    delete parsedUser[InternalKeys.Id];

                    // Create a new user
                    const user = new this();
                    user._id = id;
                    user._keyMap = new KeyMap(parsedUser);
                    user._isDirty = false;

                    // Set the new user as the current user
                    this._currentUser = user;
                }
                catch(err) {
                    throw new Error(Error.Code.ForbiddenOperation, 'Current user data is malformed. Try logging out or clearing browser cache.');
                }
            }
        }

        // Return the current user
        return this._currentUser as T;
    }

    static async logIn(options: LogInOptionsType): Promise<User> {
        // Get session details
        const session = await this._http.logIn(options);
        const sessionToken = session[InternalKeys.Auth.SessionToken];
        const revokedAt = session[InternalKeys.Auth.RevokedAt];

        return await this.become({ sessionToken, revokedAt });
    }

    static async become({ sessionToken, revokedAt }: BecomeOptionsType): Promise<User> {
        // Get user details
        const user = await this._http.become({ sessionToken });
        const revokedAtString = revokedAt? (new Date(revokedAt)).toISOString() : undefined;

        // Set the session token and the current user
        this._storage.set(InternalKeys.Auth.SessionToken, sessionToken);
        this._storage.set(InternalKeys.Auth.RevokedAt, revokedAtString);
        this._storage.set(InternalKeys.Auth.User, JSON.stringify(user));

        // Get current user
        const current = this.current();

        if(typeof current === 'undefined')
            throw new Error(Error.Code.InvalidSessionToken, 'Invalid session token');
        else
            return current;
    }

    static async logOut({ sessionToken }: LogOutOptionsType): Promise<void> {
        // Check if sessionToken is provided
        if(typeof sessionToken === 'undefined')
            sessionToken = this._storage.get(InternalKeys.Auth.SessionToken);

        // If session is logged in, log out
        if(typeof sessionToken !== 'undefined')
            await this._http.logOut({ sessionToken });

        // Remove session details
        this._clearSession();
    }

    static get usernameKey() {
        return InternalKeys.Auth.Username;
    }

    static get emailKey() {
        return InternalKeys.Auth.Email;
    }

    static get passwordKey() {
        return InternalKeys.Auth.Password;
    }

    get className(): string {
        return InternalKeys.Auth.User;
    }

    get username(): string {
        return this.get(this.statics<typeof User>().usernameKey);
    }

    get email(): string {
        return this.get(this.statics<typeof User>().emailKey);
    }

    get sessionToken(): string | void {
        return this.statics<typeof User>()._storage.get(InternalKeys.Auth.SessionToken);
    }

    set username(value: string) {
        this.set(this.statics<typeof User>().usernameKey, value);
    }

    set email(value: string) {
        this.set(this.statics<typeof User>().emailKey, value);
    }

    set password(value: string) {
        this.set(this.statics<typeof User>().passwordKey, value);
    }
}