import WarpServer, { User } from 'warp-server/typings';
import { UserClass } from 'warp-server/typings/classes/user';

export type WarpOptionsType = {
    apiKey: string,
    masterKey?: string,
    serverURL?: string,
    api?: WarpServer,
    sessionToken?: string,
    currentUser?: UserClass,
    platform?: string,
    timeout?: number,
    maxRequests?: number,
    supportLegacy?: boolean
}