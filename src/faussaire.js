import responseFactory from './request/response';
import routeFactory from './request/route';
import type { RouteType } from './request/route';

import controllerFactory from './request/controller';
import { isMatching, extractURLArgs, extractRouteParameters } from './stringUtil';

const createError = (obj) => {
  return obj;
};

/**
 * Create a faussaire instance
 *
 * @returns {Object}
 */
const createFaussaire = () => {

  let _routes:Array<RouteType> = [];
  let _onNotFoundError = responseFactory({
    data: {},
    status: 404,
    statusText: "Route not found.",
    headers: {}
  });


  const faussaire = {
    /**
     * Add a route to faussaire*
     * A route is represented by a template and the HTTP methods.
     *
     * A controller is called once the associated route match.
     * The authenticate method allows to return a token to be passed in the option
     * object for the next run call.
     *
     * The run function is the only one to be able to return a response, which is an object
     * corresponding to the response object definition (see response.js)
     */
    route: (route: RouteType) => {
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
    fetch: (url: string, method: string, requestBody: Object = {}) => {
      return new Promise((accept, reject) => {
        const matchingRoute:?RouteType = _routes.find((route: RouteType):boolean => {
          return isMatching(route.template, url) &&
            route.methods.indexOf(method.toUpperCase()) > -1
        });

        if(!matchingRoute) {
          reject(createError({
            response: _onNotFoundError
          }));
          return;
        }

        let
          query     = Object.assign({}, extractURLArgs(url), requestBody.params),
          request   = [],
          route     = extractRouteParameters(matchingRoute.template, url)
          ;

        if(method !== "GET"){
          request = requestBody.data;
        }

        const params = {
          query,
          request,
          route
        };

        // Object holding data about the process
        const options = {
          method,
          token: undefined,
        };

        // Authenticating if required
        if(typeof matchingRoute.controller.authenticate === 'function'){
          const token = matchingRoute.controller.authenticate(params, options);

          // If the token returned is a falsy value, then authentication failed.
          if(token != false){
            options.token = token;
          }
        }

        const response = matchingRoute.controller.run(params, options);
        if(response.status >= 400){
          reject(createError({
            response
          }));

          return;
        }

        return accept(response);
      });
    },

    /**
     * Set custom error when not found
     * @param response
     */
    onNotFoundError: (response: Response) => { _onNotFoundError = response; }
  };

  return faussaire;
};

export default createFaussaire();
export const Route = routeFactory;
export const Controller = controllerFactory;
export const Response = responseFactory;