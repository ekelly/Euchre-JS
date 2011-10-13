var Card = require('./card.js'),
    Stack = require('./stack.js'),
    io = require('socket.io').listen(80),
    main = require('./main.js'),
    template = require('./lib/mu.js'),
    sys = require('sys'),
    fs = require('fs');

// NOTE TO SELF:
// socket.emit can take multiple args, including functions
// the client will recieve these and put them into the
// callback function

// Helper function, checks if an object is empty
// Object -> Boolean
function isEmpty(object) { 
	for(var i in object) { 
		return true; 
	}
	return false;
}

// Personal test function to check status
function test(response, context) {
    response.write("Testing\n\n");
    var output = '';
            
    response.write("Data:  \n{\n");
    for (property in context) {
      output += "\n" + property + ': ' + context[property]+';';
      response.write("\t" + property + ": " + context[property] + ";\n");
    }
    response.write("}");
    console.log("DATA: " + output);
    response.end();
}

function play(response, context) {
    var gn = games[context['gamename']],
        game = games[gn];
    
    // TODO: Set up computer players
    // TODO: Decide how computer players will be represented
    /*
    if(game.hands.length < 4) {
        for(var i = 0; i < 4 - game['hands'].length; i++) {
            game['hands'].push(new Stack());
        }
    }
    */

	// Set up triggers for game events
	// Send each method the game information and any GET/POST vars
    game.connection
    	.on('start', main.start(game, context))
        .on('setTrump', main.setTrump(game, context))
        .on('playCard', main.playCard(game, context));
}

// Represents the 'join' world.  Game could exists, or could be created
// The player has not yet joined a game
function join(response, context) {
    // Output the HTML to display the join dialog
    // Contains links to "/wait?gamename

    /*
    Old code
    
    response.write("Game list:\n");
    for(gameName in games) {
        response.write(gameName + " : " + 
        games[gameName].hands.length + "\n");
    }
    var input = '<form name="input" action="http://localhost:8888/wait" method="get">' +
			'Game name: <input type="text" name="gamename" />' +
			'<input type="submit" Value="Submit" />' +
	'</form>';
	
	response.write(input);
	response.write('</body>');
    
    response.end();
    */
    
    var data = {
    	show: isEmpty(games)
    };
    for(gameName in games) {
        data['games'] = { 
        	name:   gameName,
        	length: games[gameName].hands.length
        };
    }
        
    template.render('index.html', data, {}, function (err, output) {
	  if (err) {
	    throw err;
	  }
	
	  var buffer = '';
	  output.addListener('data', function (c) {buffer += c;})
	        .addListener('end', function () { response.write(buffer); response.end(); });
	});
	
	
}

// Represents the 'waiting' world.  Game exists but has not started
function wait(response, context) {
    // Output the board & a button to start playing
    // That button is a Socket.io call to play()
    var gn = context['gamename'],
    	data = {};
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
            hands: [new Stack()],
            players: [],
            deck: new Stack().makeDeck(24),
            trick: [],
            tricksTaken: [],
            dealer: undefined,
            calledTrump: undefined,
            trump: undefined,
            flip: undefined,
            score: [0, 0],
            turn: undefined,
            connection: io.of('/' + gn)
                .on('connection', function (socket) {
                	if(this.hands.length < 4) {
                		if(this.players.contains(socket)) {
                			data['message'] = "You already joined game " + gn;
                			socket.emit('message', data["message"]);
                		} else {
	                		socket.set('player num', this.hands.length - 1, function() {
		                    	socket.emit('player num', {player: this.hands.length - 1});
			                    	response.write('You are player #: ' + this.hands.length);
			                });
		                	games[gn].players.push(socket);
		                	games[gn].hands.push(new Stack());
		                	this.connection.emit('join', 'Player '+games[gn].players.length+' joined');
		                }
                	}
                })
                .on('play', play)
            }
        data['message'] = "Game " + gn + " created.";
    } else if(games[gn].hands.length >= 4) {
        data['message'] = "Sorry!  Game is full";
    } else {
	    console.log(games[gn].players);
    }
    template.render('wait.html', data, {}, function (err, output) {
	  if (err) {
	    throw err;
	  }
	
	  var buffer = '';
	  output.addListener('data', function (c) {buffer += c;})
	        .addListener('end', function () { response.write(buffer); response.end(); });
	});
}

exports.test = test;
exports.join = join;
exports.play = play;
exports.wait = wait;