const responseFactory = require('./response');

/**
 * Return true if the url is matching the route
 *
 * @param route
 * @param url
 * @returns {boolean}
 */
const isMatching = (route, url) => {
  return new RegExp(route).test(url);
};

/**
 * Create a faussaire instance
 *
 * @returns {Object}
 */
const createFaussaire = () => {

  var _routes = [];
  var _onNotFoundError = responseFactory({
    data: {},
    status: 404,
    statusText: "Route not found.",
    headers: {}
  });

  const faussaire = {
    /**
     * Add a route to faussaire
     *
     * @param route ({
     *  template => string,
     *  methods => array,
     *  controller => {
     *    authenticate(params, options),
     *    run(params, options)
     *  }
     * })
     * A route is represented by a template and the HTTP methods.
     *
     * A controller is called once the associated route match.
     * The authenticate method allows to return a token to be passed in the option
     * object for the next run call.
     *
     * The run function is the only one to be able to return a response, which is an object
     * corresponding to the response object definition (see response.js)
     */
    Route: (route) => {
      _routes.push(route);
      return faussaire;
    },

    Response: (obj) => {
      return responseFactory(obj);
    },

    /**
     * Fetch the data synchronously.
     * @param url
     * @param method
     * @param params
     * @returns response
     */
    fetch: (url, method, params) => {
      for(var i = 0; i < _routes.length; i++){
        if(!isMatching(_routes[i].template, url)) {
          continue;
        }

        // Checking if the method matches the routes
        if(_routes[i].methods.indexOf(method.toUpperCase()) < 0){
          continue;
        }


        // Object holding data about the process
        const options = {
          method
        };

        if(typeof _routes[i].controller.authenticate === 'function'){
          const token = _routes[i].controller.authenticate(params, options);

          if(typeof token !== 'undefined'){
            options.token = token;
          }
        }

        return _routes[i].controller.run(params, options);
      }

      return _onNotFoundError;
    },

    onNotFoundError: response => { _onNotFoundError = response; }
  };

  return faussaire;
};

module.exports = createFaussaire();