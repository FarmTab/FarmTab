

/* http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript */
var GET = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       GET[d(e[1])] = d(e[2]);
})();