"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Copyright (c) 2017-present, Evosphere.
 * All rights reserved.
 */

var URLArgsRegex = "((\\?)([^=]+)(=(.+))?)?$";

/**
 * Return true if the url is matching the route
 *
 * @param route
 * @param url
 * @returns {boolean}
 */
var isMatching = exports.isMatching = function isMatching(route, url) {
  var urlRegex = route.replace(/{(\w)+}/g, "([^/]+)") + URLArgsRegex;
  return new RegExp(urlRegex).test(url);
};

var splitURIAndArgs = exports.splitURIAndArgs = function splitURIAndArgs(url) {
  var splitUrl = url.split('?');

  var output = {
    uri: splitUrl[0],
    args: undefined
  };

  if (splitUrl[1]) {
    output.args = splitUrl[1];
  }

  return output;
};

/**
 * Extract all the arguments from the parameters, following the ? in the URL
 * @param url
 * @returns {{}}
 */
var extractURLArgs = exports.extractURLArgs = function extractURLArgs(url) {
  var urlObject = splitURIAndArgs(url),
      obj = {};

  if (urlObject.args) {
    var pairs = urlObject.args.split('&');

    if (pairs.length === 0) {
      return obj;
    }

    [].slice.call(pairs).forEach(function (pair) {
      var keyValue = pair.split("=");
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
var extractRouteParameters = exports.extractRouteParameters = function extractRouteParameters(template, url) {
  var keys = [];

  // Store every key, and return a regex instead.
  var urlRegex = template.replace(/{(\w)+}/g, function (arg) {
    keys.push(arg.substr(1, arg.length - 2));
    return "([^?]+)";
  });

  var regex = new RegExp(urlRegex);
  var routeArgs = regex.exec(url);

  var obj = {};
  [].slice.call(routeArgs, 1).forEach(function (value, index) {
    obj[keys[index]] = value;
  });

  return obj;
};