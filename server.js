// Object containing all the game objects
games = {};

var http = require('http'),
    url = require('url'),
    qs = require('querystring')
    app = http.createServer(handler),
    router = require('./router.js'),
    sockets = require('./sockets.js');
        
io = require('socket.io').listen(app)
    
function handler (request, response) {
	sockets.start();

    var pathname = url.parse(request.url).pathname;
    
    // Get POST data
    request.addListener("data", function(chunk) {
        request.content += chunk;
    });

    request.addListener("end", function() {
        if(pathname != '/favicon.ico') {
            //parse request.content and do stuff with it
            var _get = qs.parse(url.parse(request.url).query);
            var data = qs.parse(request.content);
                       
            for (var attrname in _get) { data[attrname] = _get[attrname]; }
            router.route(pathname, response, data);
        }
    });
}

app.listen(8888, "127.0.0.1");