import { _Object } from './object';
import { LogInOptionsType, BecomeOptionsType, LogOutOptionsType } from '../types/http';
export declare class User extends _Object {
    static _currentUser: User | undefined;
    _sessionToken: string;
    static _clearSession(): void;
    /**
     * Get the currently logged in user
     * @returns {Warp.user}
     */
    static current<T extends User>(): T | undefined;
    /**
     * Log in to an account
     * @param options
     * @returns {Warp.User}
     */
    static logIn(options: LogInOptionsType): Promise<User>;
    /**
     * Log in to an active session
     * @param options
     * @returns {Warp.User}
     */
    static become({sessionToken, revokedAt}: BecomeOptionsType): Promise<User>;
    /**
     * Log out of the current session
     * @param options
     */
    static logOut({sessionToken}: LogOutOptionsType): Promise<void>;
    /**
     * Clear current session without logging out
     * > WARNING: Session will not be revoked
     */
    static clearSession(): void;
    static readonly usernameKey: string;
    static readonly emailKey: string;
    static readonly passwordKey: string;
    readonly className: string;
    username: string;
    email: string;
    readonly sessionToken: string | void;
    password: string;
}
