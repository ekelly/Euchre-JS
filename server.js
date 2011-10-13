// Object containing all the game objects
games = {};

var http = require('http'),
    app = http.createServer(handler),
    router = require('./router.js'),
    url = require('url'),
    qs = require('querystring');
    
function handler (request, response) {
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





/*
Notes/Examples of Socket.io for reference

io.sockets.on('connection', function(socket) {
    io.sockets.emit('this', { will: 'be received by everyone'});
    
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    
    var chat = io
        .of('/chat')
        .on('connection', function (socket) {
          socket.emit('a message', {
              that: 'only'
            , '/chat': 'will get'
          });
          chat.emit('a message', {
              everyone: 'in'
            , '/chat': 'will get'
          });
        });
  
    var news = io
        .of('/news')
        .on('connection', function (socket) {
          socket.emit('item', { news: 'item' });
        });

    socket.on('private message', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });
    socket.on('disconnect', function () {
        sockets.emit('user disconnected');
    });
})
*/