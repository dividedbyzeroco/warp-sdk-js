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
        - **[Subclasses](#subclasses)**
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

For example, after the `.save()` method:

```javascript
var alien = new Warp.Object('alien');
alien.set('name', 'Madam Vestra');
alien.set('type', 4);

alien.save().then(function() {
    // If this is the 200th alien, change its type, for example
    if(alien.id > 200)
        alien.set('type', 5);

    // Update the alien
    return alien.save();
    
})
.then(function() {
    // The alien has been successfully updated
});

```

For example, after retrieving from `Warp Queries`:

```javascript
var alienQuery = new Warp.Query('alien');
alienQuery.equalTo('id', 5);

alienQuery.first(function(alien) {
    alien.set('age', 30);
    return alien.save();
})
.then(function() {
    // The alien has been successfully saved
});

```

Additionally, if the key you are trying to update is an `integer` and you want to atomically increase or decrease its value, you can opt to use the `.increment()` method instead.

For example, if you want to increase the age by 1, you would use the following code:

```javascript
alien.increment('age', 1);
```

Conversely, if you want to decrease an `integer` key, you would use a negative value:

```javascript
alien.increment('life_points', -5);
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


### Files

If you need to upload [files](https://github.com/jakejosol/warp-server#files) to the server, you can do so via `Warp Files`.

For example, if you are creating an `avatar_pic` for an `alien` object, you can use the following approach.

On your web app, you would have an `input` DOM element to select files:

```html
<input type='file' name='avatar_pic' id='avatar-pic'>
```

Then, in your script, you would add the following code:

```javascript
// Select the input DOM element
var fileInput = document.querySelector('#avatar-pic');

// Check if a file is selected
if(fileInput.files.length == 0) return 'No file selected';

// Create a new Warp File using the following format: new Warp.File('{DESIRED_FILE_NAME}', '{FILE_DATA}');
//
// NOTE:
// 1. The File name does not need to be unique
// 2. File extension must be part of the file name
// 3. You may use `/` slashes for the file name (ideal for blob storage)

var avatarPic = new Warp.File('avatarPic001.jpg', fileInput.files[0]);
```

After preparing the file, you can now use `.save()` to upload it to the server, and then `.set()` to set the specified file for an object:

```javascript
avatarPic.save().then(function() {
    var alien = new Warp.Object('alien');
    alien.set('name', 'Sycorax');
    alien.set('avatar_pic', avatarPic); // Set the file directly

    // Save the new alien
    return alien.save();
})
.then(function() {
    // The alien has been successfully saved
});
```


### Subclasses

Using the `Warp Object` allows you to create objects on-the-fly without having to worry about additional configurations. If, however, you want to modularize your code into classes, you may opt to use the `.extend()` method in order to create customized subclasses.

For example, if you want to create a subclass called `Alien` that extends from `Warp.Object`, you can do so using the following code:

```javascript
var Alien = Warp.Object.extend('alien');
```

What's useful about subclasses is you can set your own `instance methods` and `static methods` just like in basic Object-oriented Programming:

```javascript
var Alien = Warp.Object.extend('alien', {
    // Instance methods
    greet: function() {
        return 'Hello! My name is ' + this.get('name');
    },
    heal: function(lifepoints) {
        this.increment('life_points', lifepoints);
    }
}, {
    // Static methods
    respawn: function(lifepoints) {
        var alien = new this;
        alien.set('life_points', lifepoints);
        return alien;
    }
})
```

Now that you've created your subclass, you can now use it in place of `Warp Object`:

```javascript
var alien = new Alien();
alien.set('name', 'The Doctor');
alien.set('life_points', 800);
alien.save().then(function() {
    // Heal the alien
    alien.heal(200);
    return alien.save();
});

var alien2 = Alien.respawn(1000);
alien2.set('name', 'The Master');
alien2.save().then(function() {
    // Successfully saved the Master
    var greeting = alien2.greet();
});
```

Additionally, you can extend the subclass even further to create more specific subclasses:

```javascript
var Dalek = Alien.extend({
    setTime: function(time) {
        this.set('time_period', time);
    }
}, {
    createWarrior: function() {
        var warrior = new this;
        warrior.set('role', 'Warrior');
        return warrior;
    }
});

var dalek = new Dalek({ name: 'Khan' });
dalek.save();
```