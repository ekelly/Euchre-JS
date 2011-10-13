/*
*	This code taken from a node.js tutorial.  http://nodebeginner.org
*/

var requestHandlers = require('./requestHandlers.js');

var handle = {};
handle["/"] = requestHandlers.join;
handle["/start"] = requestHandlers.start;
handle["/join"] = requestHandlers.join;
handle["/wait"] = requestHandlers.wait;
handle["/play"] = requestHandlers.play;
handle["/test"] = requestHandlers.test;

// Context gets passed around a lot - it's just the GET and POST variables combined
function route(pathname, response, context) {
    
    console.log("About to route a request for " + pathname);   
    
    if (typeof handle[pathname] === 'function') {
        if(context === undefined || context === null) {
            console.log("Error:  Missing data");
        } else {
            handle[pathname](response, context);
            console.log("Request routed");
        }
    } else {
        console.log("No request handler found for " + pathname);
        response.write("404:  Not Found");
    }
}

exports.route = route;