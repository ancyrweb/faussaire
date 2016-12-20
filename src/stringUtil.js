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
export const isMatching = (route, url) => {
  const urlRegex = route.replace(/{(\w)+}/g, "([^/]+)") + URLArgsRegex;
  return new RegExp(urlRegex).test(url);
};

/**
 * Extract all the arguments from the parameters, following the ? in the URL
 * @param url
 * @returns {{}}
 */
export const extractURLArgs = (url) => {
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
export const extractRouteParameters = (template, url) => {
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