import responseFactory from './response';
import routeFactory from './route';
import controllerFactory from './controller';

/**
 * Regex to match urls ending with "?args=value" and to make it
 * match precise routes.
 * See https://github.com/Rewieer/faussaire/issues/1
 *
 * @type {string}
 */
const URLArgsRegex = "((\\?)([^=]+)(=(.+))?)?$";
/**
 * Return true if the url is matching the route
 *
 * @param route
 * @param url
 * @returns {boolean}
 */
const isMatching = (route, url) => {
  return new RegExp(route + URLArgsRegex).test(url);
};

const extractURLArgs = (url) => {
  var argSection = url.split('?');
  if(argSection[1]){
    var argPairs = argSection[1].split('&');

    if(argPairs.length === 0){
      return {};
    }

    var obj = {};
    [].slice.call(argPairs).forEach(function(argPair){
      var keyValue = argPair.split("=");
      obj[keyValue[0]] = keyValue[1];
    });

    return obj;
  }

  return {};
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
    route: (route) => {
      _routes.push(route);
      return faussaire;
    },

    /**
     * Fetch the data synchronously.
     * @param url
     * @param method
     * @param requestBody
     * @returns response
     */
    fetch: (url, method, requestBody) => {
      for(var i = 0; i < _routes.length; i++){

        if(!isMatching(_routes[i].template, url)) {
          continue;
        }

        // Checking if the method matches the routes
        if(_routes[i].methods.indexOf(method.toUpperCase()) < 0){
          continue;
        }

        var query = [], request = [];

        // In GET methods, there's no need to read request's body
        // If there is a requestBody in the fetch, the user still probably
        // Wants them to be considered as query parameters
        if(method === "GET"){
          query = Object.assign({}, extractURLArgs(url), requestBody);
          request = [];
        } else {
          query = extractURLArgs(url);
          request = requestBody;
        }

        const params = {
          query,
          request
        };

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

export default createFaussaire();
export const Route = routeFactory;
export const Controller = controllerFactory;
export const Response = responseFactory;