import _Object from './object';
import { LogInOptionsType, BecomeOptionsType, LogOutOptionsType } from '../types/http';
export default class User extends _Object {
    static _currentUser: User | undefined;
    static _clearSession(): void;
    static current<T extends User>(): T | undefined;
    static logIn(options: LogInOptionsType): Promise<User>;
    static become({sessionToken, revokedAt}: BecomeOptionsType): Promise<User>;
    static logOut({sessionToken}: LogOutOptionsType): Promise<void>;
    static readonly usernameKey: string;
    static readonly emailKey: string;
    static readonly passwordKey: string;
    readonly className: string;
    username: string;
    email: string;
    password: string;
}
