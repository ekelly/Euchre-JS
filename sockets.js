var main = require('./logic.js');

function start() {
	io.sockets.on('connection', function(socket) {
    
	    socket.on('join game', function(data, responseFtn) {
		  var clients = io.sockets.clients(data);
		  
		  if(clients.length < 4) {
			  socket.set('player', clients.length, function() {
			      socket.join(data);
			      responseFtn("You've joined " + data);
			      socket.broadcast.to(data)
			        .send('Player ' + clients.length + ' joined ' + data);
			  });
		  } else {
			  response.error = 'game full';
			  responseFtn(response);
		  }
	    });
	    
	    socket.on('start game', function(game, msg) {
	    	console.log("Game " + game + " starting");
	    	var data = main.start(game, msg),
	    		clients = io.sockets.clients(game);
	    	// Message the status to everyone
	    	sockets.emit('status', data);
	    	// Let the player whose turn it is know
	    	socket.get('player', function(err, player) {
	    		if(player == data.turn) {
	    			socket.emit('turn');
	    		}
	    	});
	    	console.log("Game " + game + " started");
	    });
	    
	    socket.on('play card', function(game, card) {
	    	console.log("Received card " + card.toString());
	    	// Get socket player number
	    	socket.get('player', function (err, player) {
				var data = main.playCard(game, player, card);
				// Let everyone know what happened
				sockets.emit('status', data);
				// Let the player whose turn it is know
		    	socket.get('player', function(err, player) {
		    		if(player == data.turn) {
		    			socket.emit('turn');
		    		}
		    	});
		    });
	    });
	    
	    socket.on('set trump', function(game, action) {
	    	console.log("Setting trump… maybe");
	    	switch(action) {
				case 'pass':
					// Next player
					break;
				case 'pick up':
					// Set trump
					main.setTrump(game, trump);
					// Tell dealer to pick up & discard
					main.pickUp(game, dealer);
					// Player start
					break;
				case 'go alone':
					main.setTrump(game, trump);
					// Some logic to skip over the partner
					break;
			}
	    	main.setTrump(game, action);
	    	console.log("Setting trump (maybe) completed");
	    });
	    
	    socket.on('disconnect', function () {
	        console.log('user disconnected');
	    });
	});
}


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

exports.start = main.setup;