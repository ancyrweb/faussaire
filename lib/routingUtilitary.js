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

/**
 * return an object containing the path and the args of an URL
 * e.g : site.com/index?foo=bar would make { uri: site.com/index, args: foo=bar }
 *
 * @param url
 * @returns {{uri: string, args: string}}
 */
var splitPathAndArgs = exports.splitPathAndArgs = function splitPathAndArgs(url) {
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
  var urlObject = splitPathAndArgs(url),
      args = {};

  if (urlObject.args) {
    var pairs = urlObject.args.split('&');
    if (pairs.length === 0) {
      return args;
    }

    [].slice.call(pairs).forEach(function (pair) {
      var keyValue = pair.split("=");
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
var applyTemplateToUrl = exports.applyTemplateToUrl = function applyTemplateToUrl(template, url) {
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