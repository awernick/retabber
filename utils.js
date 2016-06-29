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
