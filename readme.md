Warp JavaScript SDK
===================

The __Warp JS SDK__ is the official JavaScript library for **[Warp Server](http://github.com/dividedbyzeroco/warp-server)**.

> NOTE: This readme is being updated for version 5.0.0. For the legacy version (i.e. versions < 5.0.0), see [readme-legacy.md](readme-legacy.md)

## Table of Contents
- **[Installation](#installation)**  
- **[Configuration](#configuration)**
- **[Objects](#objects)**
    - **[Saving Objects](#saving-objects)**
    - **[Updating Objects](#updating-objects)**
    - **[Destroying Objects](#deleting-objects)**
    - **[Pointers](#pointers)**
- **[Queries](#queries)**
    - **[Constraints](#constraints)**
    - **[Subqueries](#subqueries)**
    - **[Limit](#limit)**
    - **[Sorting](#sorting)**
    - **[Including Pointer Keys](#including-pointer-keys)**
- **[Collections](#collections)**
    - **[Counting Collections](#counting-collections)**
    - **[Filtering Collections](#filtering-collections)**
    - **[Manipulating Collections](#manipulating-collections)**
    - **[Converting Collections](#converting-collections)**
    - **[Chaining Methods](#chaining-methods)**
    
## Installation

To install Warp, simply run the following command:

```javascript
npm install --save warp-sdk-js
```

## Configuration

> NOTE: Warp 5.x uses ES6 classes. Ideally, you may want to use [Babel](https://npmjs.com/package/babel) in order to transpile your code before using in production.

### For Browsers
To initialize the SDK for **client-side development**, simply add the following configruation to the main file of your project.

```javascript
// Require Warp
import Warp from 'warp-sdk-js';

// Initialize Warp
Warp.initialize({ apiKey: '12345678abcdefg', serverURL: 'http://my-warp-server.com/api/1' });
```

### For Node
To initialize the SDK for **server-side development**, simply include the platform flag and set it to `node`.

```javascript
// Require Warp
import Warp from 'warp-sdk-js';

// Initialize Warp
Warp.initialize({ platform: 'node', apiKey: '12345678abcdefg', serverURL: 'http://my-warp-server.com/api/1' });
```

### Within Warp Server
When using the SDK for Warp Server, the api automatically adds a configured copy of Warp inside the models and functions. To access it, simply retrieve Warp from the instance.

```javascript
// Require Model
import { Model } from 'warp-server';

export default class Post extends Model.Class {
    
    static get className() { return 'post'; }

    static get keys() { return ['caption', 'photo']; }

    async beforeSave() {
        // Get Warp
        const { Warp } = this;

        // Example: Create a notification before saving
        const notification = new Warp.Object('notification');
        notification.set('message', 'A new post has been made!');
        await notification.save();

        return;
    }
}
```

For more information, visit [Warp Server](http://github.com/dividedbyzeroco/warp-server).

## Objects

An `Object` is the representation of a single `row` inside a table. It contains different properties called `Keys`. 

For example, a `Dog` class can have an instance of an `Object` called __corgi__, that has different `Keys` such as __name__, __age__, and __weight__.

Among these `Keys` are three special ones that are automatically set by the server and cannot be manually edited:

- `id`: a unique identifier that distinguishes an object inside a table
- `created_at`: a timestamp that records the date and time when an object was created (UTC)
- `updated_at`: a timestamp that records the date and time when an object was last modified (UTC)

### Saving Objects

To create an `Object`, use the `Warp.Object` class.

```javascript
var corgi = new Warp.Object('dog');
```

You can set the values of its `Keys` using the `.set()` method.

```javascript
corgi.set('name', 'Bingo');
corgi.set('age', 5);
corgi.set('weight', 32.5);
```

Then, save the Object using the `.save()` method.

```javascript
dog.save();
```

Additionally, the `.save()` method returns a promise, so you can await for it, or chain to other promises.

```javascript
// Using await
await dog.save();

// Using promises
dog.save().then(() => console.log('Saved!'));

// Providing a callback
dog.save(() => console.log('Saved!'));
```

### Updating Objects

To update the `Object` you just created, simply use the `.set()` method on its keys. Then, call the `.save()` method again.

For example

```javascript
// Prepare the Object
const corgi = new Warp.Object('dog');
corgi.set('name', 'Bingo');
corgi.set('age', 5);
corgi.set('weight', 32.5);

// Save the Object
await corgi.save();

// Change a Key
corgi.set('weight', 35);

// Update the Object
await corgi.save();

// Calling `.get()` will return the value of the key
const age = corgi.get('age'); // == 35
```

Additionally, if the key you are trying to update is defined as a `number` and you want to atomically increase or decrease its value, you can opt to use the `.increment()` method instead.

> NOTE: (See [Warp Server](http://github.com/dividedbyzeroco/warp-server) in order to find out how to declare a key as a number

For example, if you want to increase the age by 1, you would use the following code.

```javascript
// Increase the age by 1
corgi.increment('age', 1);
```

Conversely, if you want to decrease a `number` key, you would use a negative value.

```javascript
// Decrease the weight by 5
corgi.increment('weight', -5);
```

If the data has changed in the database and you need to update the copy you have, you can call the `fetch` method.

```javascript
// Fetch the latest corgi details
await corgi.fetch();

// Corgi now has the latest details
const age = corgi.get('age');
```

### Destroying Objects

If you want to delete an Object, all you need to do is call the `.destroy()` method of the object.

```javascript
dog.destroy();
```

Like `.save()`, the `.destroy()` method also returns a promise.

```javascript
// Using await
await dog.destroy();

// Using promises
dog.destroy().then(function() {
    alert('The dog has been removed');
});

// Providing a callback
dog.destroy(function() {
    alert('The alien has been removed');
});
```

### Pointers

If your objects use foreign keys, which are known to Warp as [Pointers](https://github.com/dividedbyzeroco/warp-server#pointers), you can directly set them via the `.set()` method.

For example, if you are creating a `location` pointer for a `dog` Object, you can use the following approach:

```javascript
// Create the new location
const location = new Warp.Object('location');
location.set('city', 'Manila');

// NOTE: Before you can use the `location` object, you must first save it
await location.save();

// Then, set the object inside the dog object
const pitbull = new Warp.Object('dog');
pitbull.set('location', location);

// Save the dog object
await pitbull.save();
```

If, for example, you have an existing pointer's ID and you want to use it for an object without saving a new copy, you can use `.createWithouData`.

```javascript
// Define an object without having to save
const location = Warp.Object.createWithoutData(2, 'location');

// Set the defined object
const shitzu = new Warp.Object('dog');
shitzu.set('location', location); // Set the object directly

// Save the object
await shitzu.save();
```

## Queries

Now that you have a collection of Objects inside your database, you would need a way to retrieve them. For Warp, you do this via `Queries`.

For example, if you want to query `dog` Objects, you would use the following code.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Use `.find()` to get all the objects in the `dog` table
const dogs = await dogQuery.find();

// If you want to fetch a `dog` based on its id, use `get`
const dog = await dogQuery.get(1);
```

You now have a collection of `dogs` that you can play around with.

### Constraints

Constraints help filter the results of a query. In order to pass constraints, use any of the following methods.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Find an exact match for the specified key
dogQuery.equalTo('name', 'Bingo');
dogQuery.notEqualTo('name', 'Ringo');

// If the key is ordinal (i.e. a string, a number or a date), you can use the following constraints
dogQuery.lessThan('age', 21);
dogQuery.lessThanOrEqualTo('name', 'Zack');
dogQuery.greaterThanOrEqualTo('weight', 30);
dogQuery.greaterThan('created_at', '2018-03-12 17:30:00');

// If you need to check if a field is null or not null
dogQuery.exists('breed');
dogQuery.doesNotExist('breed');

// If you need to find if a given key belongs in a list, you can use the following constraints
dogQuery.containedIn('breed', ['Malamute', 'Japanese Spitz']);
dogQuery.containedInOrDoesNotExist('breed', ['Beagle', 'Daschund']);
dogQuery.notContainedIn('age', [18, 20]);

// If you need to search a string for a substring
dogQuery.startsWith('name', 'Bing');
dogQuery.endsWith('name', 'go');
dogQuery.contains('name', 'in');

// If you need to search if a value matches several substrings
dogQuery.containsEither('description', ['small','cute','cuddly']);

// If you need to search if a value matches all substrings
dogQuery.containsAll('name', ['big','brave','trustworthy']);
```

NOTE: Queries return a special kind of list called Warp Collections. For more info, see the section on [Collections](#collections).


### Subqueries

The constraints above are usually enough for filtering queries; however, if the request calls for a more complex approach, you may nest queries within other queries.

For example, if you want to retrieve all the dogs who are residents of urban cities, you may use the following code:

```javascript
// Prepare subquery
const urbanCityQuery = new Warp.Query('location');
urbanCityQuery.equalTo('type', 'urban');

// Prepare main query
const dogQuery = new Warp.Query('dog');
dogQuery.foundIn('location.id', 'id', urbanCityQuery);

// Get dogs
const dogs = await dogQuery.find();
```

If you want to see if a value exists in either of multiple queries, you can use `.foundInEither()`:

```javascript
// Prepare subqueries
var urbanCityQuery = new Warp.Query('location');
var ruralCityQuery = new Warp.Query('location');
urbanCityQuery.equalTo('type', 'urban');
ruralCityQuery.equalTo('type', 'rural');

// Prepare main query
var dogQuery = new Warp.Query('dog');
dogQuery.foundInEither('location.id', [
    { 'id': urbanCityQuery }, 
    { 'id': ruralCityQuery }
]);

// Get dogs
const dogs = await dogQuery();
```

If you want to see if a value exists in all of the given queries, you can use `.foundInAll()`:

```javascript
// Prepare subqueries
var urbanCityQuery = new Warp.Query('location');
var smallCityQuery = new Warp.Query('location');
urbanCityQuery.equalTo('type', 'urban');
smallCityQuery.equalTo('size', 'small');

// Prepare main query
var dogQuery = new Warp.Query('dog');
dogQuery.foundInAll('location.id', [
    { 'id': urbanCityQuery }, 
    { 'id': smallCityQuery }
]);

// Get dogs
const dogs = await dogQuery();
```

Conversely, you can use `.notFoundIn()`, and `.notFoundInEither()` to retrieve objects whose key is not found in the given subqueries.

### Limit

By default, Warp limits results to the top 100 objects that satisfy the query criteria. In order to increase the limit, you can specify the desired value via the `.limit()` method. Also, in order to implement pagination for the results, you can combine the `.limit()` with the `.skip()` methods. The `.skip()` method indicates how many items are to be skipped when executing the query. In terms of scalability, it is advisable to limit results to 1000 and use skip to determine pagination.

For example:

```javascript
dogQuery.limit(1000); // Top 1000 results
dogQuery.skip(1000); // Skip the first 1000 results
```

> NOTE: It is recommended that you use the sorting methods in order to retrieve more predictable results. For more info, see the section below.


### Sorting

Sorting determines the order by which the results are returned. They are also crucial when using the limit and skip parameters. To sort the query, use the following methods:

```javascript
dogQuery.sortBy('age'); // Sorts the query by age, in ascending order
dogQuery.sortByDescending(['created_at', 'weight']); // You can also use an array to sort by multiple keys

// You can also enter the keys as separate parameters
dogQuery.sortByDescending('crated_at', 'weight');
```

### Including Pointer Keys

In order to include keys that belong to a pointer, we can use the `.include()` method.

```javascript
dogQuery.include('location.city');
dogQuery.include('location.type');
```

The above query will return dogs with their respective location as pointers:

```javascript
const dogs = await dogQuery.find();

dogs.forEach(function(alien) {
    // Get the greeting
    var greeting = 'I am ' + dog.get('name') + ' and I come from ' + alien.get('location').get('city');

    console.log(greeting);
    return;
});
```

## Collections

When using queries, the results returned by `.find()` will be a collection of Warp Objects. Collections are a special list for Warp that allows you to filter, sort and manipulate list items by using a set of in-built methods.


### Counting Collections

To count the results, use the following methods.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Get dogs
const dogs = await dogQuery.find();

// Gets the total count
const total = dogs.count();
```


### Filtering Collections

To filter the results and return a new collection based on these filters, use the following methods.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Get dogs
const dogs = await dogQuery.find();

// Returns the first Object
const firstDog = dogs.first();    

// Returns a collection of Warp Objects that return true for the given function
const oldDogsOnly = dogs.where(alien => alien.get('age') > 12);
```


### Manipulating Collections

To manipulate the results, use the following methods.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Get dogs
const dogs = await dogQuery.find();

// Looks through each Object and applies the given function
dogs.forEach(dog => console.log(dog.get('bark')));

// Returns an array of whatever the given function returns
const names = dogs.map(dog => dog.get('name'));

// Looks through each Object and executes every function as a series of promises
dogs.each(dog => dog.destroy());
```

### Converting Collections

Oftentimes, you may opt to use regular array lists to handle Objects. To accomodate this, Collections contain the following methods.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Get dogs
const dogs = await dogQuery.find();

// Returns an array of Warp Objects
const dogArray = dogs.toArray();

// Returns an array of object literals
const dogJSON = dogs.toJSON();
```


### Chaining Methods

Since Collections return new Collections after every method, you can chain several methods together, as needed.

```javascript
// Prepare query
const dogQuery = new Warp.Query('dog');

// Get dogs
const dogs = await dogQuery.find();

// Find corgis, and return their names
const corgiNames = dogs.where(dog => dog.get('breed') === 'corgi')
    .map(dog => dog.get('name'));
```