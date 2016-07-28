Warp JavaScript SDK
===================

__The Warp JS SDK__ is a library for implementing the Warp Framework using JavaScript. It is designed to work with projects built on-top of the **[Warp Server](http://github.com/jakejosol/warp-server)**.

## Table of Contents
- **[Installation](#installation)**  
- **[Configuration](#configuration)**
- **Features**
    - **[Objects](#objects)**
        - **[Creating Objects](#creating-objects)**
        - **[Updating Objects](#updating-objects)**
        - **[Deleting Objects](#deleting-objects)**
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
    - **Files - Coming Soon**
    - **Functions - Coming Soon** 
    
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

## Objects

Objects represent individual instances of models. In terms of the database, an Object can be thought of as being a `row` in a table. Throughout the Warp Framework, Objects are the basic vehicles for data to be transmitted to and fro the server.

Each Object contains different keys which can be set or retrieved as needed. Among these keys are three special ones:

- id: a unique identifier that distinguishes an object inside a table
- created_at: a timestamp that records the date and time when a particular object was created (UTC)
- uppdated_at: a timestamp that records the date and time when a particular object was last modified (UTC)

These keys are specifically set by the server and cannot be modified by the user.


### Creating Objects

To create an Object for a specific model, use the `Warp.Object` class:

```javascript
var alien = new Warp.Object('alien');
```

You can set the values of the Object's keys using the `.set()` method:

```javascript
alien.set('name', 'The Doctor');
alien.set('age', 150000);
alien.set('type', 4);
```

Then, save the Object using the `.save()` method:

```javascript
alien.save();
```

Additionally, the `.save()` method returns a promise, which you can chain other processes to:

```javascript
alien.save().then(function() {
    alert('The alien has been created with the following ID: ' + alien.id);
    alert('The alien has been named: ' + alien.get('name'));
});

// or

alien.save(function() {
    alert('The alien has been created at: ' + alien.createdAt);
    alert('The alien has been updated at: ' + alien.updatedAt);
});
```