// @flow
/**
 * Copyright (c) 2017-present, Evosphere.
 * All rights reserved.
 */

/**
 * Regex to match urls ending with "?args=value" and to make it
 * match precise routes.
 *
 * @type {string}
 */
const URLArgsRegex : string = "((\\?)([^=]+)(=(.+))?)?$";

/**
 * Return true if the url is matching the route
 *
 * @param route
 * @param url
 * @returns {boolean}
 */
export const isMatching = (route: string, url: string) : boolean => {
  const urlRegex = route.replace(/{(\w)+}/g, "([^/]+)") + URLArgsRegex;
  return new RegExp(urlRegex).test(url);
};

/**
 * return an object containing the path and the args of an URL
 * e.g : site.com/index?foo=bar would make { uri: site.com/index, args: foo=bar }
 *
 * @param url
 * @returns {{uri: string, args: string}}
 */
export const splitPathAndArgs = (url: string): Object => {
  const splitUrl = url.split('?');

  let output: {uri: string, args: ?string} = {
    uri: splitUrl[0],
    args: undefined
  };

  if(splitUrl[1]){
    output.args = splitUrl[1];
  }

  return output;
};

/**
 * Extract all the arguments from the parameters, following the ? in the URL
 * @param url
 * @returns {{}}
 */
export const extractURLArgs = (url: string):Object => {
  let
    urlObject     = splitPathAndArgs(url),
    args           = {}
  ;

  if(urlObject.args){
    let pairs = urlObject.args.split('&');
    if(pairs.length === 0){
      return args;
    }

    [].slice.call(pairs).forEach(function(pair){
      let keyValue = pair.split("=");
      args[keyValue[0]] = keyValue[1];
    });

    return args;
  }

  return {};
};

/**
 * Apply the template to the url to return captured values
 *
 * From template such as http://url.com/post/{id}
 * with url such as http://url.com/post/3
 * This function will match ID with the value 3.
 *
 * @param template
 * @param url
 * @returns {{}}
 */
export const applyTemplateToUrl = (template: string, url: string): Object => {
  let keys = [];

  // Store every key, and return a regex instead.
  let urlRegex = template.replace(/{(\w)+}/g, arg => {
    keys.push(arg.substr(1, arg.length - 2));
    return "([^?]+)";
  });

  let regex = new RegExp(urlRegex);
  let routeArgs = regex.exec(url);

  let obj = {};
  [].slice.call(routeArgs, 1).forEach((value, index) => {
    obj[keys[index]] = value;
  });

  return obj;
};