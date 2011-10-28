var Card = require('./card.js'),
    Stack = require('./stack.js'),
    main = require('./logic.js'),
    template = require('./lib/mu.js'),
    sys = require('sys'),
    fs = require('fs');

// Helper function, checks if an object is empty
// Object -> Boolean
function isEmpty(object) { 
	for(var i in object) { 
		return true; 
	}
	return false;
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

// Represents the 'join' world.  Game could exist, or could be created
// The player has not yet joined a game
function join(response, context) {
    // Output the HTML to display the join dialog
    // Contains links to "/wait?gamename
    
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

// Represents the 'waiting' screen.  Game exists but has not started
function wait(response, context) {
    var gn = context['gamename'],
    	data = {
    		name: gn
    	},
    	clients = io.sockets.clients(gn);
    if(games[gn] == undefined) {
        games[gn] = main.setup(gn);
        data['message'] = "Game " + gn + " created.";
    } else if(clients.length >= 4) {
        data['message'] = "Sorry!  Game is full";
    } else {
	    //console.log(games[gn].players);
	    data['message'] = "Game: " + gn;
    }
    template.render('game.html', data, {}, function (err, output) {
	  if (err) {
	    throw err;
	  }
	
	  var buffer = '';
	  output.addListener('data', function (c) {buffer += c;})
	        .addListener('end', function () { response.write(buffer); response.end(); });
	});
}

function jsServe() {
	
}

exports.jsServe = jsServe;
exports.join = join;
exports.game = wait;
exports.wait = wait;