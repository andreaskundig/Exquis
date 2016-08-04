/**
This is to add libraries that can be used from requirejs
if you include them as a script.
*/

var addScript = function(src){
    var headID = document.getElementsByTagName("head")[0];         
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = src;
    headID.appendChild(newScript);
};

addScript("/bibs/paper-core.js");
