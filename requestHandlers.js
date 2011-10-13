var Card = require('./card.js'),
    Stack = require('./stack.js'),
    io = require('socket.io').listen(80),
    main = require('./main.js'),
    template = require('./lib/mu.js'),
    sys = require('sys'),
    fs = require('fs');


// socket.emit can take multiple args, including functions
// the client will recieve these and put them into the
// callback function


function start(response, context) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World\n");
    response.end();
}

function showFile(loc) {
    fs.readFile(loc, function(err, data) {
        if (err) {
            response.writeHead(500);
            response.end('Error loading index.html');
            return;
        }
        
        response.writeHead(200);
        response.end(data);
    });
}

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
    // Main Logic code
    // AJAX/Sockets only
    var gn = games[context['gamename']],
        game = games[gn];
    
    // TODO: Set up computer players
    /*
    if(game.hands.length < 4) {
        for(var i = 0; i < 4 - game['hands'].length; i++) {
            game['hands'].push(new Stack());
        }
    }
    */
    //game.dealer = Math.floor(Math.random()*4);
    game.connection
    	.on('start', main.start(game, context))
        .on('setTrump', main.setTrump(game, context))
        .on('playCard', main.playCard(game, context));
}

function join(response, context) {
    // Output the HTML to display the join dialog
    // Contains links to "/wait?gamename
    //showFile('./index.html');
    var data = {};
    /*
    response.write("Game list:\n");
    for(gameName in games) {
        response.write(gameName + " : " + 
        games[gameName].hands.length + "\n");
        data['games'] = { 
        	name:   gameName,
        	length: games[gameName].hands.length
        };
    }
    var input = '<form name="input" action="http://localhost:8888/wait" method="get">' +
			'Game name: <input type="text" name="gamename" />' +
			'<input type="submit" Value="Submit" />' +
	'</form>';
	
	response.write(input);
	response.write('</body>');
    
    response.end();
    */
    
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

function wait(response, context) {
    // Output the board & a button to start playing
    // That button is a Socket.io call to play()
    var gn = context['gamename'];
    if(games[gn] == undefined) {
        games[gn] = {
            /*
    Each player's hand - [Stack, Stack, Stack, Stack]
    The deck - Stack
    The trick - [Card, Card, Card, Card]
    How many tricks have been played / won - [Number, Number, Number, Number] 
    The dealer - Player
    Who called trump - Player
    The score - [Number, Number]
    Who's turn it is - Player
    Communication with this 'room' - socket.io connection
            */
            hands: [new Stack()],
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
                			response.write('You already joined game '+gn);
                		} else {
	                		socket.set('player num', this.hands.length - 1, function() {
		                    socket.emit('player num', {player: this.hands.length - 1});
			                    response.write('You are player #: ' + this.hands.length);
			                });
		                	games[gn].players.push(socket);
		                }
                	}
                })
                .on('play', play)
            }
        response.write('Game ' + gn + ' created.');
    } else if(games[gn].hands.length >= 4) {
        response.write('Sorry!  Game is full');
    } else {
        games[gn].hands.push(new Stack());
        games[gn].connection.emit('join', 'Player '+games[gn].players.length+' joined');
    }
    response.end();
}

exports.start = start;
exports.test = test;
exports.join = join;
exports.play = play;
exports.wait = wait;