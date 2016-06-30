// http://stackoverflow.com/questions/12220345/how-to-compare-two-urls-in-javascript-or-jquery
function getDomain(url) {
  var prefix = /^https?:\/\//i;
  var domain = /^[^\/]+/;
  url = url.replace(prefix, "");

  var match = url.match(domain);
  if (match) {
    return(match[0]);
  }
  return(null);
}

function getProtocol(url) {
  var protocol = /^[^:]+/;
  var match = url.match(protocol);
  if(match) {
    return match[0];
  } else {
    return null;
  }
}

// http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck 
    && getType.toString.call(functionToCheck) === '[object Function]';
}
