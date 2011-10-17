var main = require('./logic.js');

function start() {
	io.sockets.on('connection', function(socket) {
    
	    socket.on('join game', function(data, responseFtn) {
		  var clients = io.sockets.clients('room');
		  
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
	    	main.start(game, msg);
	    	console.log("Game " + game + " started");
	    });
	    
	    socket.on('play card', function(game, card) {
	    	console.log("Received card " + card.toString());
	    	// Get socket player number
	    	socket.get('player', function (err, player) {
				main.playCard(game, player, card);
		    });
	    });
	    
	    socket.on('set trump', main.setTrump);
	    
	    socket.on('disconnect', function () {
	        console.log('user disconnected');
	    });
	});
}

function setUpGame(gn) {

    if(games[gn] == undefined) {    
    	// Create the game
    	/*
		    Each player's hand - [Stack, Stack, Stack, Stack]
		    The deck - Stack
		    The trick - [Card, Card, Card, Card]
		    How many tricks have been played / won - [Number, Number, Number, Number] 
		    The dealer - Player
		    Who called trump - Player
		    trump - Suit
		    flip - Card flipped over
		    The score - [Number, Number]
		    Who's turn it is - Player
		    Communication with this 'room' - socket.io connection
        */
        games[gn] = {
            hands: [new Stack(), new Stack(), new Stack(), new Stack()],
            deck: new Stack().makeDeck(24),
            trick: [],
            tricksTaken: [],
            dealer: undefined,
            calledTrump: undefined,
            trump: undefined,
            flip: undefined,
            score: [0, 0],
            turn: undefined,
        }
    }
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