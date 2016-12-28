# Faussaire v0.3.1 - Instable - Documentation not up to date
Lightweight javascript library to mock network request for testing purposes

## Status
This project is still an idea and probably needs further improvements. Suggests and PR are
welcome.

## Installation
```
npm install --save-dev faussaire
```

## Overview

Faussaire is library aiming to mock an API in tests. As said Robert C. Martin in
the [Ruby Midwest 2011 Conf](https://www.youtube.com/watch?v=WpkDN78P884), tests should be completely independent from
your webservices, your database or whatever kind of IO device / Network implementation. Following this idea, one should
be able to use a fake API with a similar behavior of any server.

Faussaire implements a simple interface allowing you to create route with URLs and method, and to put a controller to
return a response object. Using the `fetch()` method you can easily make calls and simulate a response.

## Usage Example

### Basic usage

You can register a route using faussaire.Route.

```js
import faussaire, {Route, Controller, Response} from 'faussaire';

faussaire
  .route(Route({
    template: "http://foo.com",
    methods: ["GET"],
    controller: Controller({
      run: (params, options) => {
        return Response({
          data: {
            foo: params.query.foo,
            bar: params.query.bar
          },
          status: 200,
          statusText: "OK"
        })
      }
    })
  }));

const response = faussaire.fetch("http://foo.com", "GET", {
  params: {
    foo: "bar",
    bar: "qux"
  }
});
```

#### The params object

Usually, all controller's method can access the params. It is an object composed of :
* `query` : holds GET parameters (`?foo=1&bar=2`)
* `request` : holds POST parameters
* `route` : holds routing request (see below)

#### Templating

You can give a simple URL to a template, but if you want to build complex URL matching, you can use Regex.
```js
faussaire.route(
  Route({
    template: "http://foo.com/(\\w+)/access",
    methods: ["GET"],
    ...
  })
);
```

You can also match routing point with values and get them in the parameters using brackets.
```js
faussaire.route(
  Route({
    template: "http://foo.com/posts/{id}",
    methods: ["GET"],
    ...
  })
);
```

You will find the ID in `params.route.id`.

### Authentication

You can as well pre-authenticate the user sending a request by defining an `authenticate(params, options)` in the
controller. It should return a token in case of success and it will be stored in the options object as `options.token`.
If the authentication fail, there wont be any token object in options.

```js
import faussaire, {Route, Controller, Response} from 'faussaire';

faussaire
  .route(Route({
    template: "http://foo.com/ressouce",
    methods: ["GET"],
    controller: Controller({
      authenticate: function(params, options){
        if(params.apikey){
          return {
            apikey: params.query.apikey,
            at: Date.now(),
            expire: //...
          }
        }
      },
      run: (params, options) => {
        if(options.token){
          return Response({
            status: 200,
            statusText: "OK"
          })
        }

        return Response({
          status: 403,
          statusText: "Wrong credentials"
        })
      }
    })
  }));

const response = faussaire.fetch("http://foo.com", "GET", {
  params: {
    foo: "bar",
    bar: "qux"
  }
});
```
## API

### faussaire.fetch: (url, method, params) => response (Object)

The equivalent of a standard fetch.

### faussaire.route: (route) => faussaire

Adds a route to Faussaire.

### Route: (Object) => Object

Return a route with :
* template : usually a URL or a Regex. If the URL matches the template, the controller starts processing.
* methods : an array of HTTP methods to handle (basically ["GET"])
* controller : a Controller type object processing the request.

#### Controller: (Object) => Object

Return a controller with :
* `run(params, options)`: this function must return a response. The options holds a method entry and might have additionnal
data passed by authenticate for example.
* `authenticate(params, options')`: must return an object representing an authentication token if the request hold
enough information to recognize the user, or return nothing/undefined.

### Response: (Object) => Object

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

const request = (url, method, params) => {
  if(process.env.NODE_ENV === "test"){
    return faussaire(url, method, params);
  }

  return fetch(url, method, params);
};

export default request;
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
* Must be updated as your backend evolves

## Evolutions

* Handling Promises
* Proper means to authenticate
* Handle data storage and standard functions to avoid repeating schemas (like CRUD)
* Simulate timeout if wanted (you probably don't in testing but might be useful for offline support)
* Get closer to what a network request flow should look alike (in term of headers, etc)
* Add Listeners to look for a certain template and then call subscribers when it happen, and/or pass additional
options to the controller (like Symfony Events Listeners)
* Create an additional library to manage storage and simulate a database
* Start an idiomatic-faussaire tutorial to use it properly

## Related
* [faussaire-util](https://github.com/Rewieer/faussaire-util), bundle utilitary functions for faussaire