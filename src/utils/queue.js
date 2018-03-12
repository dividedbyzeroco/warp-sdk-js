// @flow
/**
 * References
 */
import Error from './error';

export default class Queue {

    _requestInterval: number = 200; // milliseconds
    _maxRequests: number;
    _timeout: number;
    _requests: number = 0;

    constructor(maxRequests: number, requestInterval: number, timeout: number) {
        this._maxRequests = maxRequests;
        this._requestInterval = requestInterval;
        this._timeout = timeout;
    }

    _sleep(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, this._requestInterval));
    }

    async push(request: Promise<any>): Promise<any> {

        // If maximum requests is reached, sleep
        while(this._requests >= this._maxRequests) await this._sleep();

        // Increase number of requests
        this._requests++;

        return await new Promise((resolve, reject) => {
            // Prepare timeout and finish flags
            let hasTimedOut = false;
            let hasFinished = false;
            
            // Execute the request
            request.then(result => {
                // If it has not yet timed out, resolve
                if(!hasTimedOut) {
                    // Set has finished to true
                    hasFinished = true;

                    // Decrease number of requests
                    this._requests--;
    
                    return resolve(result);
                }
            })
            .catch(err => {
                // Check if it has timed out
                if(hasTimedOut) return;

                // Decrease number of requests
                this._requests--;

                // Catch error
                hasFinished = true;
                reject(err);
            });

            // Prepare timer
            setTimeout(() => {
                // Check if it has finished
                if(hasFinished) return;

                // Change timeout indicator
                hasTimedOut = true;

                // Return an error
                reject(new Error(Error.Code.InternalServerError, 'Request timed out'));
            }, this._timeout * 1000);
        });
    }
}