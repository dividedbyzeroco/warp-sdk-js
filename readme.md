Warp JavaScript SDK
===================

__The Warp JS SDK__ is a library for implementing the Warp Framework using client-side JavaScript. It is designed to work with projects built on-top of the WarpServer.

### Installation

To install the Warp JS SDK via npm, simply use the install command to save it in your package.json:

```javascript
npm install --save warp-sdk-js
```

### Configuration

To initialize the SDK, simply add the following configruation to the main file of your project:

```javascript
// Require Warp
var Warp = require('warp-sdk-js');

// Initialize Warp
Warp.initialize({ apiKey: '12345678abcdefg', baseURL: 'http://my-warp-server.com/api/1' });
```

### Warp.Object

```javascript
// Objects
var dalek = new Warp.Object('dalek');
dalek.set('age', 20);
dalek.set('name', 'Kal');
dalek.save();

var dalek = new Warp.Object('dalek', { name: 'Ran', color: 'green' });
dalek.save();

// Subclasses
var dalek = new Dalek();
dalek.set('name', 'Paz');
dalek.save().then(function() {
    dalek.greet();
});

// Pointers
var doctor = new Doctor(11);
var companion = new Comapnion({ name: 'Donna Noble' });
doctor.save().then(function() {
    doctor.greet();
    companion.set('doctor', doctor);
    return companion.save(); 
})
.then(function() {
    companion.greet(); 
});

// Queries
var dalekQuery = new Warp.Query('dalek');
dalekQuery.equalTo('age', 25)
.find(function(daleks) {
    daleks.each(dalek => dalek.greet());
});

var dalekQuery = new Warp.Query(Dalek);
dalekQuery.greaterThan('age', 100)
.containedIn('color', ['blue', 'green'])
.sortBy(['color', 'age'])
.find(function(daleks) {
    daleks.each(dalek => dalek.greet());
});

var dalekQuery = new Warp.Query(Dalek);
var companionQuery = new Warp.Query('companion');
var doctorQuery = new Warp.Query(Doctor);
dalekQuery.foundIn('enemy', 'name', companionQuery);
dalekQuery.notFoundIn('friend', 'name', doctorQuery);

// Collections
var daleks = dalekCollection;
daleks.count();
daleks.where(dalek => dalek.get('age') > 200);
daleks.equalTo({ age: 30, color: 'green'}).sortBy('color');
daleks.map(dalek => dalek.createdAt);
daleks.each(dalek => dalek.greet());
daleks.toList(); // Turns to array

// Users
var user = new Warp.User();
user.setUsername('test_user101');
user.setPassword('P-s5wQrd');
user.setEmail('test_user101@sample.com');
user.signUp();

Warp.User.logIn('test_user101', 'P-s5wQrd')
.then(function() {
    Warp.User.current();
});

Warp.User.logOut();
```