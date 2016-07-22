Warp JavaScript SDK
===================

__The Warp JS SDK__ is a library for implementing the Warp Framework using JavaScript. It is designed to work with projects built on-top of the WarpServer.

## Table of Contents
- **[Installation](#installation)**  
- **[Configuration](#configuration)**
- **Features**
    - **[Objects](#objects)**
        - **[Subclasses](#subclasses)**
        - **[Pointers](#pointers)**
    - **[Queries](#queries)**
        - **[Constraints](#constraints)**
        - **[Limit](#limit)**
        - **[Sorting](#sorting)**
        - **[Including Pointer Keys](#including-pointer-keys)**
    - **[Users](#users)**
        - **[Logging In](#logging-in)**
        - **[Validating Users/Fetching Current User](#validating-usersfetching-current-user)**
        - **[Signing Up](#signing-up)**
        - **[Logging Out](#logging-out)**
    - **Files - COMING SOON**
    - **Functions - COMING SOON** 
    
## Installation

To install the Warp JS SDK via npm, simply use the install command to save it in your package.json:

```javascript
npm install --save warp-sdk-js
```

## Configuration

To initialize the SDK, simply add the following configruation to the main file of your project:

```javascript
// Require Warp
var Warp = require('warp-sdk-js');

// Initialize Warp
Warp.initialize({ apiKey: '12345678abcdefg', baseURL: 'http://my-warp-server.com/api/1' });
```

Or, if you are going to use the SDK on the same server as your `Warp Server`, simply use the `Warp` property of your `Warp Server` instance:

```javascript
var api = new WarpServer(config);
var Warp = api.Warp;
```

NOTE: If you use the `Warp` property of your `Warp Server` instance, you do not need to call the `.initialize()` method. This is the recommended approach especially for Warp Functions and Warp Models.
