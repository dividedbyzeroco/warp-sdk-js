Warp JavaScript SDK
===================

__The Warp JS SDK__ is a library for implementing the Warp Framework using client-side JavaScript. It can easily be configured to work with projects built on-top of the WarpServer.

### Installation

To install the Warp JS SDK via npm, simply use the install command to save it in your package.json:

```javascript
npm install --save warp-client
```

### Configuration

To initialize the SDK, simply add the following configruation to the main file of your project:

```javascript
// Require Warp
var Warp = require('warp-js');

// Initialize Warp
Warp.initialize({ apiKey: '12345678abcdefg', baseURL: 'http://my-warp-server.com/api/1' });
```