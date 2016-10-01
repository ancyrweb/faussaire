# Faussaire
Lightweight javascript library to mock network request for testing purposes

## Status
This project is still an idea and probably needs further improvements. Suggests and PR are
welcome.

## Overview

Faussaire is library aiming to mock an API in tests. As said Robert C. Martin in
the [Ruby Midwest 2011 Conf](https://www.youtube.com/watch?v=WpkDN78P884), tests should be completely independant from
your webservices, your database or whatever kind of IO device / Network implementation. Following this idea, one should
be able to use a fake API with a similar behavior of any server.

Faussaire implements a simple interface allowing you to create route with URLs and method, and to put a controller to
return a response object. Using the `fetch()` method you can easily make calls and simulate a response.

## Usage Example

### Basic usage

You can register a route using faussaire.Route.

```js
import faussaire from 'Faussaire';

faussaire
  .Route({
    template: "http://foo.com",
    methods: ["GET"],
    controller: {
      run: (params, options) => {
        return faussaire.Response({
          data: {
            foo: params.foo,
            bar: params.bar
          },
          status: 200,
          statusText: "OK"
        })
      }
    }
  });

const response = faussaire.fetch("http://foo.com", "GET", {foo: "bar", bar: "qux"});
```
### Authentication

You can as well pre-authenticate the user sending a request by defining an `authenticate(params, options)` in the
controller. It should return a token in case of success and it will be stored in the options object as `options.token`.
If the authentication fail, there wont be any token object in options.

```js
import faussaire from 'Faussaire';

faussaire
  .Route({
    template: "http://foo.com/ressouce",
    methods: ["GET"],
    controller: {
      authenticate: function(params, options){
        if(params.apikey){
          return {
            apikey: params.apikey
            at: Date.now()
            expire: //...
          }
        }
      },
      run: (params, options) => {
        if(options.token){
          return faussaire.Response({
            status: 200,
            statusText: "OK"
          })
        }

        return faussaire.Response({
          status: 403,
          statusText: "Wrong credentials"
        })
      }
    }
  });

const response = faussaire.fetch("http://foo.com", "GET", {foo: "bar", bar: "qux"});
```
## API

### faussaire.fetch: (url, method, params) => response (Object)

The equivalent of a standard fetch.

### faussaire.Route: (route) => faussaire

Adds a route to Faussaire.

### faussaire.Response: (Object) => Object

Return a basic HTTP response with :
* data : the body's response
* status : the HTTP code
* statusText : the response header
* headers : a list of headers (like Location)

## Usage in Production

You might want to make your own Fetch interface using Faussaire to automate switching between network fetching and local
fetching.
This is how it can be implemented :

```js
import fetch from 'fetch';
import faussaire from 'faussaire';

const fetch = (url, method, params) => {
  if(process.env.NODE_ENV === "test"){
    return faussaire(url, method, params);
  }

  return fetch(url, method, params);
};

export default fetch;
```

## Pros and Cons
### Pros
* Easy to use and to mock routing & stores
* Pushes you to use proper testing habits
* Allows you to work offline

### Cons
* Not implementing Promise yet
* Makes you rewrite an API, only for testing and offline development, which is a cost of time
* Young and therefore lacks possibilities

## Evolutions

* Handling Promises
* Proper means to authenticate
* Handle data storage and standard functions to avoid repeating schemas (like CRUD)
* Simulate timeout if wanted (you probably don't in testing but might be useful for offline support)
* Get closer to what a network request flow should look alike (in term of headers, etc)