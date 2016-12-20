import responseFactory from './request/response';
import routeFactory from './request/route';
import controllerFactory from './request/controller';
import { isMatching, extractURLArgs, extractRouteParameters } from './stringUtil';

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
     * @returns Promise
     */
    fetch: (url, method, requestBody = {}) => {
      return new Promise((accept, reject) => {
        const matchingRoute = _routes.find(r =>
          isMatching(r.template, url) && r.methods.indexOf(method.toUpperCase()) > -1
        );

        if(!matchingRoute) {
          reject(throwError({
            response: _onNotFoundError
          }));
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
          reject(throwError({
            response
          }));
        }

        return accept(response);
      });
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