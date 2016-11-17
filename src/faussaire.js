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
  const urlRegex = route.replace(/{(\w)+}/g, "([^/]+)") + URLArgsRegex;
  return new RegExp(urlRegex).test(url);
};

/**
 * Extract all the arguments from the parameters, following the ? in the URL
 * @param url
 * @returns {{}}
 */
const extractURLArgs = (url) => {
  let str = url.split('?'),
      obj = {}
  ;

  if(str[1]){
    let pairs = str[1].split('&');

    if(pairs.length === 0){
      return obj;
    }

    [].slice.call(pairs).forEach(function(pair){
      let keyValue = pair.split("=");
      obj[keyValue[0]] = keyValue[1];
    });

    return obj;
  }

  return {};
};

/**
 * Extract routing parameters
 *
 * From template such as http://url.com/post/{id}
 * with url such as http://url.com/post/3
 * This function will match ID with the value 3.
 *
 * @param template
 * @param url
 * @returns {{}}
 */
const extractRouteParameters = function(template, url){
  let keys = [];

  let urlRegex = template.replace(/{(\w)+}/g, function(arg){
    keys.push(arg.substr(1, arg.length - 2));
    return "([^?]+)";
  });

  let regex = new RegExp(urlRegex);
  let routeArgs = regex.exec(url);

  let obj = {};
  [].slice.call(routeArgs, 1).forEach(function(t, i){
    obj[keys[i]] = t;
  });

  return obj;
};

/**
 * Create a faussaire instance
 *
 * @returns {Object}
 */
const createFaussaire = () => {

  let _routes = [];
  let _onNotFoundError = responseFactory({
    data: {},
    status: 404,
    statusText: "Route not found.",
    headers: {}
  });

  const throwError = (obj) => {
    return Object.assign({}, new Error(), obj);
  };

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
    fetch: (url, method, requestBody = {}) => {
      const matchingRoute = _routes.find(r =>
        isMatching(r.template, url) && r.methods.indexOf(method.toUpperCase()) > -1
      );

      if(!matchingRoute) {
        throw throwError({
          response: _onNotFoundError
        });
      }

      let query   = [],
          request = [],
          route   = extractRouteParameters(matchingRoute.template, url)
        ;

      // In GET methods, there's no need to read request's body
      // If there is a requestBody in the fetch, the user still probably
      // Wants them to be considered as query parameters
      if(method === "GET"){
        query = Object.assign({}, extractURLArgs(url), requestBody.params);
        request = [];
      } else {
        query = Object.assign({}, extractURLArgs(url), requestBody.params);
        request = requestBody.data;
      }

      const params = {
        query,
        request,
        route
      };

      // Object holding data about the process
      const options = {
        method
      };

      if(typeof matchingRoute.controller.authenticate === 'function'){
        const token = matchingRoute.controller.authenticate(params, options);

        if(typeof token !== 'undefined'){
          options.token = token;
        }
      }

      const response = matchingRoute.controller.run(params, options);
      if(response.status >= 400){
        throw throwError({
          response
        });
      }

      return response;
    },

    /**
     * Set custom error when not found
     * @param response
     */
    onNotFoundError: response => { _onNotFoundError = response; }
  };

  return faussaire;
};

export default createFaussaire();
export const Route = routeFactory;
export const Controller = controllerFactory;
export const Response = responseFactory;