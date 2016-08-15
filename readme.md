Warp JavaScript SDK
===================

__The Warp JS SDK__ is a library for implementing the Warp Framework using JavaScript. It is designed to work with projects built on-top of the **[Warp Server](http://github.com/jakejosol/warp-server)**.

## Table of Contents
- **[Installation](#installation)**  
- **[Configuration](#configuration)**
- **Features**
    - **[Objects](#objects)**
        - **[Saving Objects](#saving-objects)**
        - **[Retrieving Objects](#retrieving-objects)**
        - **[Updating Objects](#updating-objects)**
        - **[Deleting Objects](#deleting-objects)**
        - **[Pointers](#pointers)**
        - **[Files](#files)**
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


### Saving Objects

To save an Object for a specific model, use the `Warp.Object` class:

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


### Retrieving Objects

To retrieve an Object for a specific model, you can use `Warp Queries`. For more info, see the section on [Queries](#queries):

```javascript
var alienQuery = new Warp.Query('alien');
alienQuery.equalTo('id', 16);
alienQuery.first().then(function(alien) {
    // You now have a copy of alien (id: 16) from the database
});
```

Now that you have fetched the object, you can also get its keys using the `.get()` method:

```javascript
var name = alien.get('name');
var age = alien.get('age');
var type = alien.get('type');
```

For special keys as mentioned in the section on [Objects](#objects), you can retrieve their values via the following properties:

```javascript
var id = alien.id;
var createdAt = alien.createdAt;
var updatedAt = alien.updatedAt;
```

Note that these fields cannot be retrieved via the `.get()` method.


### Updating Objects

Whenever you use `.save()` or `Warp Queries` to save/retrieve objects, you can modify the keys of these objects directly using the same `.set()` method. Warp automatically knows that you've updated these fields and prepares the object for updating.

```javascript
alien.set('name', 'New name');
alien.set('type', '5');
```

After setting the new keys, you can simply call `.save()` again in order to save the changes to the database.

```javascript
alien.save()
```


### Deleting Objects

If you want to delete a saved or retrieved object, all you need to do is call the `.destroy()` method of the object:

```javascript
alien.destroy();
```

Additionally, like `.save()`, the `.destroy()` method also returns a promise, which you can chain other processes to:

```javascript
alien.destroy().then(function() {
    alert('The alien has been destroyed');
});

// or

alien.destroy(function() {
    alert('The alien has been destroyed');
});
```


### Pointers

If your objects use [pointers](https://github.com/jakejosol/warp-server#pointers) for some of its keys, you can directly set them via the `.set()` method.

For example, if you are creating a `planet` for an `alien` object, you can use the following approach:

```javascript
var planet = new Warp.Object('planet');
planet.set('name', 'Raxocoricofallipatorius');

// NOTE: Before you can use the `planet` object, you must first save it
planet.save(function() {
    var alien = new Warp.Object('alien');
    alien.set('name', 'Slitheen');
    alien.set('planet', planet); // Set the object directly
    return alien.save();
})
.then(function() {
    // The alien has been successfully saved
});
```

If, for example, you have an existing `planet` and you want to use it for an `alien` object, you can use the following approach:

```javascript
var planetQuery = new Warp.Query('planet');
planetQuery.equalTo('id', 2);
planetQuery.first().then(function(planet) {
    // You now have a copy of planet (id: 2)
    var alien = new Warp.Object('alien');
    alien.set('name', 'Captain Jack Harkness');
    alien.set('planet', planet); // Set the object directly
    return alien.save();
})
.then(function() {
    // The alien has been successfully saved
});
```
