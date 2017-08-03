// @flow
/**
 * Copyright (c) 2017-present, Evosphere.
 * All rights reserved.
 */

import {
  isMatching,
  applyTemplateToUrl,
  extractURLArgs
} from './routingUtilitary';

type HttpMethod = "POST" | "GET" | "PATCH" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";
type HttpRequestResult = {
  status: "done" | "network-error" | "timeout",
  response: mixed,
}
type Waiter = {
  url: string,
  method: HttpMethod,
  consumable: boolean, // If set to true, the waiter is removed after being called
  action: (request: Request) => Response | "timeout",
};

export type Response = {
  data: mixed,
  statusCode: number,
  headers: ?Object,
}

export type Result = HttpRequestResult;
export type Request = {
  url: string,
  method: HttpMethod,
  query?: ?{[key: string]: mixed},
  request?: ?{[key: string]: mixed},
  route?: ?{[key: string]: mixed},
};


/**
 * Mutate the request to enhance it :
 * - pattern matching : match site.com/foo/{id} and site.com/foo/1 to return { id: 1 } in the route bag
 * - extract URL arguments (foo=bar&qux) into the queryBag
 * - fill in the request bag
 * @param request
 * @param url
 */
function enhanceRequest(request : Request, url : string){
  let
    queryBag     = Object.assign({}, extractURLArgs(request.url), request.query),
    requestBag   = {},
    routeBag     = applyTemplateToUrl(url, request.url)
  ;

  // In case of anything but a GET request, we fill the request variable with the body's data
  if(request.method !== "GET"){
    requestBag = request.request;
  }

  request.query = queryBag;
  request.request = requestBag;
  request.route = routeBag;
}

/**
 * @module Faussaire
 * Mock API calls responses.
 *
 * Faussaire allows to preconfigure a response. The user can then make a fake "request". An internal router will
 * associate the URL and Method given to the preconfigured response.
 * The preconfigured response can be configured. It can be "consumable" which means after the router has matched an URL
 * with the response, it is removed from it.
 *
 * The Waiters is a queue. We look in reverse mode : that is, the last waiter registered is the first to be checked.
 *
 * This is how the algorithm works :
 * - We call the "emit" function with an URL, a method, and bunch of configuration like headers, timeout, etc
 * - we look for a preconfigured response whose waiting for this URL and this method
 * - Once we have a route, we check his "action"
 *   - if it's an "execute", we execute the function called "trigger", and we return it's output
 *   - if it's a "timeout", we return a timeout
 * - If we don't have a return, we output a standard 404-like error
 */
function Faussaire(){
  this.waiters = [];
}

/**
 * Add a waiter to the queue
 * @param config
 * @returns {Faussaire}
 */
Faussaire.prototype.observe = function(
  config: { url: string, method: HttpMethod, action: (request: Request) => Response | "timeout", consumable?: boolean }
) : Faussaire {
  const nextWaiter : Waiter = Object.assign({}, {
    consumable: true,
  }, config);

  // We add the element at the top of the array because faussaire is LIFO
  this.waiters.unshift(nextWaiter);
  return this;
};

/**
 * Forward a request to the last registered waiter and return a result
 * @param request
 * @returns {Result}
 */
Faussaire.prototype.emit = function(request: Request) : Result {
  let
    correspondingWaiter: ?Waiter  = null,
    response: ?Response           = null,
    result: ?Result               = null
  ;

  correspondingWaiter = this.waiters.find((waiter: Waiter) => {
    return isMatching(waiter.url, request.url) && waiter.method === request.method;
  });

  if(correspondingWaiter){
    if(typeof correspondingWaiter.action === "function"){
      enhanceRequest(request, correspondingWaiter.url);

      response = correspondingWaiter.action(request);
      result = { status: "done", response };
    } else if(correspondingWaiter.action === "timeout"){
      result = Faussaire.createTimeoutResult();
    } else {
      result = Faussaire.createNetworkErrorResult();
    }

    if(correspondingWaiter.consumable === true){
      this.waiters = this.waiters.filter((waiter: Waiter) => waiter !== correspondingWaiter);
    }
  } else {
    result = Faussaire.createNotFoundResult();
  }

  return result;
};

const defaultResults = {
  timeout: {
    response: null,
    status: "timeout",
  },
  networkError: {
    response: null,
    status: "network-error",
  },
  notFound: {
    response: {
      statusCode: 404,
      data: null,
      headers: null,
    },
    status: "done",
  }
};

/**
 * Create a generic timeout result
 * @returns {{response: null, status: string}}
 */
Faussaire.createTimeoutResult = function(){
  return defaultResults.timeout;
};

/**
 * Create a generic timeout result
 * @returns {{response: null, status: string}}
 */
Faussaire.createNetworkErrorResult = function(){
  return defaultResults.networkError;
};

/**
 * Creates a generic not found result
 * @returns {{response: {statusCode: number, data: null, headers: null}, status: string}}
 */
Faussaire.createNotFoundResult = function(){
  return defaultResults.notFound;
};

export default {
  /**
   * @returns {Faussaire}
   */
  create: () => new Faussaire(),
}