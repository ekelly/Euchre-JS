var main = require('./logic.js'),
	test = require('./testing.js');

function start() {
	io.sockets.on('connection', function(socket) {
    	
	    socket.on('join game', function(data, responseFtn) {
	      console.log("Join game request");
		  var clients = io.sockets.clients(data);
		  if(clients.length < 4) {
			  socket.set('player', clients.length, function() {
			      socket.join(data);
			      responseFtn("You've joined " + data);
			      socket.broadcast.to(data)
			        .send('Player ' + clients.length + ' joined ' + data);
			      console.log('Player ' + clients.length + ' joined ');
			      /*
			      games[data].players[clients.length - 1] = socket;
			      */
			  });
		  } else {
			  var response = { error: 'game full' };
			  responseFtn(response);
		  }
	    });
	    
	    // String ->
	    socket.on('start game', function(game) {
	    	console.log("Game " + game + " starting");
	    	var data = main.start(games[game]),
	    		clients = io.sockets.clients(game);
	    	// Message the status to everyone
	    	io.sockets.in(game).emit('status', data);
	    	// Let the player whose turn it is know
	    	tellPlayerTurn(data.turn, game);
	    	console.log("Game " + game + " started");
	    });
	    
	    // String Card -> 
	    socket.on('play card', function(game, card) {
	    	console.log("Received card " + card.toString());
	    	// Get socket player number
	    	socket.get('player', function (err, player) {
				var nextPlayer = main.playCard(games[game], player, card);
				// Let everyone know what happened
				io.sockets.in(game)('status', games[game].round);
				// If a new round needs to start
				if(nextPlayer == -1) {
					main.newRound();
					// Broadcast the new status
					io.sockets.in(game)('status', games[game].round);
				}
				// If a new trick needs to start
				if(games[game].round.trick.length == 4) {
					games[game].round.trick = [];
					// Broadcast the new status
					io.sockets.in(game)('status', games[game].round);
				}
				// Let the player whose turn it is know
				tellPlayerTurn(nextPlayer, game);
				/*
		    	games[game].players[nextPlayer].emit('turn');
		    	*/
		    });
	    });
	    
	    // TODO: going alone support
	    socket.on('trump', function(gname, action, trump) {
	    	var g = games[gname];
	    	console.log("Setting trump… maybe");
	    	switch(action) {
				case 'pass':
					// Next player
					socket.get('player', function(err, player) {
						tellPlayerTurn(main.nextPlayer(player), g);
					});
					break;
				case 'pick up':
					// Set trump
					socket.get('player', function(err, pnum) {
						main.setTrump(g.round, g.round.flip.trump, pnum);
					});
					// Tell dealer to pick up & discard
					tellPlayer(g.round.dealer, gname, 'pick up flip', {});
					// Receive discarded card
					socket.on('discard', function(card) {
						// Start the round
						tellPlayerTurn(main.nextPlayer(dealer), gname);
					});
					break;
				case 'choose trump':
					if(trump != g.round.flip.trump) {
						socket.get('player', function(err, pnum) {
							main.setTrump(g.round, trump, pnum);
						});
					}
					// Send the status to everyone

					// Tell the lead player it's his turn
					tellPlayerTurn(main.nextPlayer(dealer), gname);
					break;
			}
	    	main.setTrump(game, action);
	    	console.log("Setting trump (maybe) completed");
	    });
	    
	    socket.on('disconnect', function () {
	        console.log('user disconnected');
	    });
	    
	    socket.on('test', function() {
	    	test.test();
	    });
	    
	});
}

// Informs the player that it is their turn
// Player String -> 
function tellPlayerTurn(nextPlayer, game) {
	tellPlayer(nextPlayer, game, 'turn', {});
}

// Tells the specified player the specified message
// Player String String Object ->
function tellPlayer(player, game, msg, data) {
	var clients = io.sockets.clients(game),
		socket;
	for(socket in clients) {
		clients[socket].get('player', function(err, pnum) {
			if(pnum == player) {
				socket.emit(msg, data);
			}
		});
	}
}

exports.start = start;