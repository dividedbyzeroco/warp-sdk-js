Warp JavaScript SDK
===================

__The Warp JS SDK__ is a library for implementing the Warp Framework using JavaScript. It is designed to work with projects built on-top of the **[Warp Server](http://github.com/dividedbyzeroco/warp-server)**.

## Table of Contents
- **[Installation](#installation)**  
- **[Configuration](#configuration)**
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
    - **[Subqueries](#subqueries)**
    - **[Limit](#limit)**
    - **[Sorting](#sorting)**
    - **[Including Pointer Keys](#including-pointer-keys)**
- **[Collections](#collections)**
    - **[Counting Collections](#counting-collections)**
    - **[Filtering Collections](#filtering-collections)**
    - **[Sorting Collections](#sorting-collections)**
    - **[Manipulating Collections](#manipulating-collections)**
    - **[Converting Collections](#converting-collections)**
    - **[Chaining Methods](#chaining-methods)**
- **[Users](#users)**
    - **[Getting Special User Keys](#getting-special-user-keys)**
    - **[Logging In](#logging-in)**
    - **[Fetching Current User](#fetching-current-user)**
    - **[Signing Up](#signing-up)**
    - **[Logging Out](#logging-out)**
- **[Functions](#functions)**
    
## Installation

To install the Warp JS SDK via npm, simply use the install command to save it in your package.json:

```javascript
npm install --save warp-sdk-js
```

## Configuration

To initialize the SDK for **client-side development**, simply add the following configruation to the main file of your project:

```javascript
// Require Warp
var Warp = require('warp-sdk-js');

// Initialize Warp
Warp.initialize({ apiKey: '12345678abcdefg', baseURL: 'http://my-warp-server.com/api/1' });
```

Or, if you are going to use the SDK for **server-side development** on `Warp Server` (ex. `Warp Functions`, `Warp Queues`, or `Warp Models`), simply use the `Warp` property of your `Warp Server` instance:

```javascript
// Instantiate Warp Server
var api = new WarpServer(/* configuration */);

// Set up the Warp Server router for express
var app = express();
app.use('/api/1', api.router());

// Get the Warp SDK directly from the api instance
var Warp = api.Warp;
```

COMING SOON: **server-side development** outside of `Warp Server`

## Objects

Objects represent individual instances of models. In terms of the database, an Object can be thought of as being a `row` in a table. Throughout the Warp Framework, Objects are the basic vehicles for data to be transmitted to and fro the server.

Each Object contains different keys which can be set or retrieved as needed. Among these keys are three special ones:

- id: a unique identifier that distinguishes an object inside a table
- created_at: a timestamp that records the date and time when a particular object was created (UTC)
- updated_at: a timestamp that records the date and time when a particular object was last modified (UTC)

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

If your objects use [pointers](https://github.com/dividedbyzeroco/warp-server#pointers) for some of its keys, you can directly set them via the `.set()` method.

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
// Warp.Object.createWithoutData({ID}, '{CLASS_NAME}');
// For users, Warp.User.createWithoutData({ID});
var planet = Warp.Object.createWithoutData(2, 'planet');
var alien = new Warp.Object('alien');
alien.set('name', 'Captain Jack Harkness');
alien.set('planet', planet); // Set the object directly

alien.save(function() {
    // The alien has been successfully saved
});
```


### Files

If you need to upload [files](https://github.com/dividedbyzeroco/warp-server#files) to the server, you can do so via `Warp Files`.

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
    initialize: function() {
        // NOTE: `.initialize()` is a special method, it is called whenever a new object is created
    },
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

What's important is that for every subclass that you make, you must register them before you initialize Warp:

```javascript
Warp.Object.registerSubclass(Alien);
Warp.Object.registerSubclass(Dalek);
Warp.Object.registerSubclass(Planet);
Warp.initialize({ apiKey: '12345678abcdefg', baseURL: 'http://my-warp-server.com/api/1' });
```

## Queries

There are certain scenarios when you may need to find Objects from a model. In these instances, it would be convenient to use Queries. Queries allow you to find specific Objects based on a set of criteria.

For example, if you want to query objects from the `alien` model, you would use the following code:

```javascript
// Prepare query
var alienQuery = new Warp.Query('alien');

// Use `.find()` to get all the objects in the `alien` table
alienQuery.find().then(function(aliens) {
    // You now have a collection of all the aliens
});

// Use `.first()` to get the first object in the `alien` table
alienQuery.first().then(function(alien) {
    // You now have the first alien object
});
```

If you've created subclasses via the `.extend()` method of the `Warp Object`, you can set the subclass as the parameter in place of the model name. By using this approach, you get to use the instance methods that you initialized for the subclass:

```javascript
var alienQuery = new Warp.Query(Alien);

alienQuery.find(function(aliens) {
    aliens.each(function(alien) {
        var greeting = alien.greet();
        console.log(greeting);
        return;
    });
});
```

### Constraints

Constraints help filter the results of a specific query. In order to pass constraints for a Query, use any of the following constraints you wish to apply:

```javascript
// Prepare query
var alienQuery = new Warp.Query('alien');

// Find an exact match for the specified key
alienQuery.equalTo('name', 'The Doctor');
alienQuery.notEqualTo('name', 'The Master');

// If the key is ordinal (i.e. a string, a number or a date), you can use the following constraints
alienQuery.lessThan('age', 21);
alienQuery.lessThanOrEqualTo('name', 'Weeping Angels');
alienQuery.greaterThanOrEqualTo('life_points', 500);
alienQuery.greaterThan('created_at', '2016-08-15 17:30:00+00:00');

// If you need to check if a field is null or not null
alienQuery.exists('type');
alienQuery.doesNotExist('type');

// If you need to find if a given key belongs in a list, you can use the following constraints
alienQuery.containedIn('role', ['Doctor', 'Warrior']);
alienQuery.notContainedIn('age', [18, 20]);

// If you need to search a string for a substring
alienQuery.startsWith('name', 'The');
alienQuery.endsWith('name', 'Master');
alienQuery.contains('name', 'M');

// If you need to search multiple keys for a substring
alienQuery.contains(['name', 'username', 'email'], 'M');
```

NOTE: Queries return a special kind of list called Warp Collections, which you can filter, sort or manipulate. For more info, see the section on [Collections](#collections).


### Subqueries

The constraints above are usually enough for filtering queries; however, if the request calls for a more complex approach, you may nest queries within other queries.

For example, if you want to retrieve all the aliens who are residents of friendly planets, you may use the following code:

```javascript
var friendlyPlanetsQuery = new Warp.Query('planet');
friendlyPlanetsQuery.equalTo('type', 'friendly');

// Use the following format
// .foundIn({KEY IN ALIEN}, {KEY IN PLANET}, {SUBQUERY});
var alienQuery = new Warp.Query('alien');
alienQuery.foundIn('planet_id', 'id', friendlyPlanetsQuery);

alienQuery.find().then(function(friendlyAliens) {
    // You now have a collection of friendly aliens
});
```

Conversely, you can use `.notFoundIn()` to retrieve objects whose key is not found in the given subquery.

If you want to see if a value exists in either of multiple queries, you can use `.foundInEither()`:

```javascript
var friendlyPlanetsQuery = new Warp.Query('planet');
var goodPlanetsQuery = new Warp.Query('planet');
friendlyPlanetsQuery.equalTo('type', 'friendly');
goodPlanetsQuery.equalTo('type', 'good');

// Use the following format
// .foundInEither({KEY IN ALIEN}, [ {KEY IN PLANET : SUBQUERY}, ... ]);
var alienQuery = new Warp.Query('alien');
alienQuery.foundInEither('planet_id', [{ 'id': friendlyPlanetsQuery }, { 'id': goodPlanetsQuery }]);

alienQuery.find().then(function(friendlyAliens) {
    // You now have a collection of friendly and good aliens
});
```


### Limit

By default, Warp limits results to the top 100 objects that satisfy the query criteria. In order to increase the limit, you can specify the desired value via the `.limit()` method. Also, in order to implement pagination for the results, you can combine the `.limit()` with the `.skip()` methods. The `.skip()` method indicates how many items are to be skipped when executing the query. In terms of scalability, it is advisable to limit results to 1000 and use skip to determine pagination.

For example:

```javascript
alienQuery.limit(1000); // Top 1000 results
alienQuery.skip(1000); // Skip the first 1000 results
```

NOTE: It is recommended that you use the sorting methods in order to retrieve more predictable results. For more info, see the section below.


### Sorting

Sorting determines the order by which the results are returned. They are also crucial when using the limit and skip parameters. To sort the query, use the following methods:

```javascript
alienQuery.sortBy('age'); // Sorts the query by age, in ascending order
alienQuery.sortByDescending(['created_at', 'life_points']); // You can also use an array to sort by multiple keys
```


### Including Pointer Keys

In order to include keys that belong to a pointer, we can use the `.include()` method.

```javascript
alienQuery.include('planet.name');
alienQuery.include('planet.color');
```

The above query will return aliens with their respective planets as pointers:

```javascript
alienQuery.find().then(function(aliens) {
    aliens.each(function(alien) {
        // NOTE: alien.get('planet') returns a Warp Object, which means you can also use .get(), id, createdAt, and updatedAt
        var greeting = 'I am ' + alien.get('name') + ' and I come from the Planet ' + alien.get('planet').get('name');

        console.log(greeting);
        return;
    });
});
```

## Collections

When using queries, the results returned by `.find()` will be a collection of Warp Objects. Collections are a special list for Warp that allows you to filter, sort and manipulate list items by using a set of in-built methods.


### Counting Collections

To count the results, use the following methods:

```javascript
var alienQuery = new Warp.Query('alien');

alienQuery.find().then(function(aliens) {
    // In this case, `aliens` is a collection
    var totalAliens = aliens.count();
});
```


### Filtering Collections

To filter the results and return a new collection based on these filters, use the following methods:

```javascript
var alienQuery = new Warp.Query('alien');

alienQuery.find().then(function(aliens) {
    // Returns the first Warp Object
    var firstAlien = aliens.first();    
    
    // Returns a collection of Warp Objects that match the given object
    var redDaleksOnly = aliens.match({ type: 'Daleks', color: 'red' });

    // Returns a collection of Warp Objects that return true for the given function
    var oldAliensOnly = aliens.where(function(alien) {
        return alien.get('age') > 100;
    });
});
```


### Sorting Collections

To sort the results and return a new collection, use the following methods:

```javascript
var alienQuery = new Warp.Query('alien');

alienQuery.find().then(function(aliens) {
    // Returns a new collection sorted in ascending order
    var aliensSortedByLifePoints = aliens.sortBy('life_points');

    // Returns a new collection sorted in descending order
    var aliensSortedByCreatedAt = aliens.sortByDescending('created_at');
    
});
```


### Manipulating Collections

To manipulate the results, use the following methods:

```javascript
var alienQuery = new Warp.Query('alien');

alienQuery.find().then(function(aliens) {
    // Looks through each Warp Object and applies the given function
    // NOTE: You can return Promises inside the function and it will wait for each promise to finish before continuing to the next item
    aliens.each(function(alien) {
        return alien.destroy();
    });

    // Returns an array of whatever the given function returns
    var names = aliens.map(function(alien) {
        return alien.get('name');
    });

    // As an added bonus, you can use ES2015 lambda functions inside these methods
    aliens.each(alien => alien.destroy());

    var names = aliens.map(alien => alien.get('name'));
    
});
```


### Converting Collections

Often times, you may opt to use regular array lists to handle Warp Objects. In these cases, you can convert Warp Collections using the following methods:

```javascript
var alienQuery = new Warp.Query('alien');

alienQuery.find().then(function(aliens) {
    // Returns a list of Warp Objects
    var alienArray = aliens.toList();

    // Returns a list of regular JavaScript Objects similar to the REST API
    // For more info, visit http://github.com/dividedbyzeroco/warp-server/blob/master/rest.md
    var alienJSON = aliens.toJSON();
});
```


### Chaining Methods

Since Warp Collections return new Collections after every method, you can chain several methods together, as needed:

```javascript
var alienQuery = new Warp.Query('alien');

alienQuery.find().then(function(aliens) {
    // Find red aliens, sort them by life points and then return their name
    var redAliens = aliens.where({ color: 'red' })
                    .sortBy('life_points')
                    .map(alien => alien.get('name'));
});
```

## Users

User accounts are often an essential part of an application. In Warp, these are represented by Warp Users. Warp Users are extended from the Warp Object, which means you can use the same methods found in Warp Objects; however, Warp Users have additional methods specifically tailored for user account management.


### Getting Special User Keys

Aside from id, createdAt and updatedAt, Warp User also has the following get methods:

```javascript
var userQuery = new Warp.Query(Warp.User);
userQuery.equalTo('id', 5).first().then(user => {
    var id = user.id;
    var createdAt = user.createdAt;
    var updatedAt = user.updatedAt;
    var username = user.getUsername();
    var email = user.getEmail();
});
```

Note that for Warp Query, instead of specifiying 'user' as the string, we can simply place Warp.User as the parameter.


### Logging In

In order to log in to a user account, you would use the `.logIn()` method:

```javascript
Warp.User.logIn('username', 'password', function(user) {
    // Successfully logged in
}, function(error) {
    // There was an error
});

// or

Warp.User.logIn('username', 'password')
.then(function(user) {
    // Successfully logged in
})
.catch(function(error) {
    // There was an error
});
```

Note that you cannot use `.logIn()` when using the Warp JS SDK for server-side development.

### Fetching Current User

To get the currently logged in user, you would use the `.current()` method:

```javascript
var current = Warp.User.current();
```


### Signing Up

To register a new user account, you would use the `.signUp()` method:

```javascript
var user = new Warp.User();
user.setUsername('Luke Smith');
user.setPassword('k9_and_sara');

user.signUp(function() {
    // Signed up; `.current()` returns the registered user
    var current = Warp.User.current();
}, function(error) {
    // There was an error
});

// or

user.signUp()
.then(function() {
    // Signed up; `.current()` returns the registered user
    var current = Warp.User.current();
})
.catch(function() {
    // There was an error
});
```

Note that you cannot use `.save()` to create a user. You can only use `.save()` to update a user which has been registered or logged in.
Also, note that you cannot use `.signUp()` when using the Warp JS SDK for server-side development.


### Logging Out

To log out of a user account, you would use the `.logOut()` method:

```javascript
user.logOut(function() {
    // Logged out; `.current()` now returns null
    var current = Warp.User.current();
}, function(error) {
    // There was an error
});

// or

user.logOut()
.then(function() {
    // Logged out; `.current()` now returns null
    var current = Warp.User.current();
})
.catch(function(error) {
    // There was an error
});
```

## Functions

To run Warp [Functions](http://github.com/dividedbyzeroco/warp-server#functions) from the API, you may use Warp Functions:

```javascript
// Warp.Function.run({FUNCTION_NAME}, {PARAMETERS})

Warp.Function.run('get-votes', { from: '2016-08-14', to: '2016-08-15' }, function(result) {
    // `result` contains a JSON Object of the results from the API
}, function(error) {
    // There was an error
});

// or

Warp.Function.run('get-votes', { from: '2016-08-14', to: '2016-08-15' })
.then(function(result) {
    // `result` contains a JSON Object of the results from the API
})
.catch(function(error) {
    // There was an error
});
```